import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toISOString().split('T')[0];

    const { data: existingBriefing } = await supabase
      .from('daily_briefings')
      .select('*')
      .eq('briefing_date', today)
      .maybeSingle();

    if (existingBriefing) {
      return new Response(
        JSON.stringify({
          message: 'Briefing already exists for today',
          briefing: existingBriefing,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data: todayArticles, error: articlesError } = await supabase
      .from('articles')
      .select('*, sources(name)')
      .eq('approved', true)
      .gte('published_at', startOfDay.toISOString())
      .lte('published_at', endOfDay.toISOString())
      .order('published_at', { ascending: false });

    if (articlesError) throw articlesError;

    const { data: todayEvents, error: eventsError } = await supabase
      .from('escalation_events')
      .select('*')
      .eq('verified', true)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('severity', { ascending: false });

    if (eventsError) throw eventsError;

    const confirmed = todayArticles?.filter(a => a.verification_status === 'confirmed') || [];
    const developing = todayArticles?.filter(a => a.verification_status === 'developing') || [];

    const keyEvents = (todayEvents || []).slice(0, 10).map((event: any) => ({
      description: `${event.event_type.replace('_', ' ')}: ${event.description} (${event.location})`,
      severity: event.severity,
      time: new Date(event.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }));

    const militaryEvents = todayEvents?.filter((e: any) =>
      ['missile_launch', 'airstrike', 'drone_strike', 'ground_operation', 'naval_activity'].includes(e.event_type)
    ) || [];

    const diplomaticEvents = todayEvents?.filter((e: any) =>
      e.event_type === 'diplomatic'
    ) || [];

    const summary = generateSummary(confirmed, developing, todayEvents || []);
    const militaryMovements = militaryEvents.length > 0
      ? generateMilitarySection(militaryEvents)
      : null;
    const diplomaticUpdates = diplomaticEvents.length > 0
      ? generateDiplomaticSection(diplomaticEvents)
      : null;

    const { data: briefing, error: insertError } = await supabase
      .from('daily_briefings')
      .insert({
        briefing_date: today,
        summary,
        key_events: keyEvents,
        military_movements: militaryMovements,
        diplomatic_updates: diplomaticUpdates,
        potential_developments: generatePotentialDevelopments(todayEvents || []),
        confirmed_count: confirmed.length,
        developing_count: developing.length,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        message: 'Daily briefing generated successfully',
        briefing,
        stats: {
          total_articles: todayArticles?.length || 0,
          confirmed: confirmed.length,
          developing: developing.length,
          events: todayEvents?.length || 0,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function generateSummary(confirmed: any[], developing: any[], events: any[]): string {
  const totalEvents = confirmed.length + developing.length;

  if (totalEvents === 0) {
    return 'No significant developments reported today. Regional tensions remain stable with ongoing monitoring of military activities and diplomatic channels.';
  }

  const highSeverityEvents = events.filter((e: any) => e.severity >= 7);
  const eventTypes = [...new Set(events.map((e: any) => e.event_type))];

  let summary = `Today saw ${totalEvents} reported ${totalEvents === 1 ? 'development' : 'developments'} `;
  summary += `in the Iran-US-Israel conflict zone, with ${confirmed.length} confirmed `;
  summary += `${confirmed.length === 1 ? 'report' : 'reports'} and ${developing.length} developing ${developing.length === 1 ? 'story' : 'stories'}. `;

  if (highSeverityEvents.length > 0) {
    summary += `${highSeverityEvents.length} high-severity ${highSeverityEvents.length === 1 ? 'event was' : 'events were'} recorded, `;
    summary += `including ${eventTypes.slice(0, 3).map(t => t.replace('_', ' ')).join(', ')}. `;
  }

  summary += 'Multiple intelligence sources continue to monitor the situation closely.';

  return summary;
}

function generateMilitarySection(events: any[]): string {
  const sections: string[] = [];

  const missiles = events.filter((e: any) => e.event_type === 'missile_launch');
  const airstrikes = events.filter((e: any) => e.event_type === 'airstrike');
  const drones = events.filter((e: any) => e.event_type === 'drone_strike');
  const naval = events.filter((e: any) => e.event_type === 'naval_activity');

  if (missiles.length > 0) {
    sections.push(`• ${missiles.length} missile ${missiles.length === 1 ? 'launch' : 'launches'} detected in ${[...new Set(missiles.map((e: any) => e.location))].join(', ')}`);
  }

  if (airstrikes.length > 0) {
    sections.push(`• ${airstrikes.length} ${airstrikes.length === 1 ? 'airstrike' : 'airstrikes'} reported`);
  }

  if (drones.length > 0) {
    sections.push(`• ${drones.length} drone ${drones.length === 1 ? 'strike' : 'strikes'} confirmed`);
  }

  if (naval.length > 0) {
    sections.push(`• Naval activity observed in the Persian Gulf region`);
  }

  return sections.join('\n');
}

function generateDiplomaticSection(events: any[]): string {
  if (events.length === 0) return '';

  const locations = [...new Set(events.map((e: any) => e.location))];

  let text = `${events.length} diplomatic ${events.length === 1 ? 'development' : 'developments'} reported today`;

  if (locations.length > 0) {
    text += ` involving ${locations.join(', ')}`;
  }

  text += '. International mediators continue engagement efforts to de-escalate tensions.';

  return text;
}

function generatePotentialDevelopments(events: any[]): string {
  const highSeverity = events.filter((e: any) => e.severity >= 7);

  if (highSeverity.length === 0) {
    return 'Continued monitoring of regional military movements and diplomatic channels expected. No immediate escalation indicators at this time.';
  }

  return 'Given recent high-severity events, heightened alert status maintained across the region. Potential for further military responses being closely monitored by intelligence services. Diplomatic channels remain active to prevent escalation.';
}
