# Conflict Watch - Advanced Intelligence Features

## Overview

Conflict Watch is a comprehensive real-time intelligence platform for tracking the Iran-US-Israel conflict. The platform automatically aggregates verified news from trusted sources and provides advanced intelligence features.

## Features Implemented

### 1. Live Conflict Map
- **Location**: Homepage sidebar, Map page (`/map`), Intelligence Dashboard
- **Features**:
  - Real-time event markers for strikes, military movements, conflict locations
  - Color-coded severity levels
  - Verification status display
  - Event history with recent activity feed
- **Database**: `map_events` table tracks geographic events linked to articles

### 2. War Escalation Level Meter
- **Location**: Homepage (top banner)
- **Features**:
  - Live threat level indicator: 🟢 Low → 🟡 Military Activity → 🟠 Major Strikes → 🔴 Regional War
  - Numeric score 0-100
  - Trend indicators (up/down/stable)
  - Auto-updates based on verified events
- **Database**: `escalation_levels` table tracks current threat status by region

### 3. War Timeline
- **Location**: `/timeline` page
- **Features**:
  - Complete chronological record of all verified conflict events
  - Severity ratings (1-10)
  - Event type filtering (missile launch, airstrike, drone strike, etc.)
  - Visual timeline with severity indicators
  - Date grouping for easy navigation
- **Database**: `escalation_events` table

### 4. Intelligence Dashboard
- **Location**: `/intelligence` page
- **Features**:
  - Military situation room interface
  - Live escalation meter
  - Regional risk assessment map
  - OSINT intelligence feed
  - Quick stats (active alerts, verified events, reports)
  - Multiple data source indicators
- **Combined Data**: Integrates all intelligence features

### 5. War Risk Map
- **Location**: Intelligence Dashboard, Homepage sidebar
- **Features**:
  - Country-by-country risk assessment
  - Risk levels: Low, Medium, High, Critical
  - Risk scores (0-100)
  - Contributing factors for each region
  - Color-coded visualization
- **Database**: `risk_assessments` table with 10+ countries pre-configured

### 6. Daily War Briefing
- **Location**: `/briefing` page
- **Features**:
  - Comprehensive daily summaries
  - Key events timeline
  - Military movements analysis
  - Diplomatic updates
  - Potential developments forecast
  - Confirmed vs developing event counts
  - Historical briefings archive (30 days)
- **Database**: `daily_briefings` table

### 7. OSINT Intelligence Feed
- **Location**: Intelligence Dashboard
- **Features**:
  - Verified social media intelligence
  - Multiple source types (Twitter/X, Telegram, Official, Analyst)
  - Author verification badges
  - Reliability scoring (0-100%)
  - Direct links to original sources
  - Real-time updates
- **Database**: `osint_posts` table

### 8. Civilian Safety Information
- **Location**: `/safety` page
- **Features**:
  - Emergency contact numbers by region
  - Shelter location information
  - Evacuation alerts
  - Safe zone designations
  - Priority-based alert system (Urgent, High, Medium, Low)
  - Safety guidelines
  - Emergency preparedness tips
- **Database**: `civilian_safety` table

### 9. Breaking News Alert System
- **Features**:
  - Alert creation for critical events
  - Priority levels (low, medium, high, critical)
  - Alert types (missile, airstrike, diplomatic, ceasefire)
  - Ready for push notification integration
  - Admin dashboard for alert management
- **Database**: `alerts` table
- **Integration Ready**: OneSignal or Firebase Cloud Messaging

### 10. Admin Dashboard Enhancements
- **Location**: `/admin` page
- **Features**:
  - Approve/reject articles
  - Manual article creation
  - Edit summaries and verification status
  - Mark breaking news
  - Category management
  - Source management
  - Real-time content moderation

## Technology Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS with dark theme
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Real-time Updates**: Supabase Realtime subscriptions

### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (ready for admin login)
- **Edge Functions**: Deno runtime on Supabase
  - RSS Feed Collector (`collect-rss-feeds`)
  - AI Article Summarizer (`summarize-articles`)

### Data Sources
- Reuters RSS Feed
- BBC Middle East RSS Feed
- Associated Press RSS Feed
- Al Jazeera RSS Feed

## Database Schema

### Core Tables
1. **articles** - News articles with AI summaries
2. **sources** - Trusted news sources with RSS feeds
3. **categories** - Article categories
4. **map_events** - Geographic conflict events

### Intelligence Tables
5. **escalation_events** - Major events affecting escalation levels
6. **escalation_levels** - Current threat status by region
7. **alerts** - Breaking news alerts for notifications
8. **daily_briefings** - Auto-generated daily summaries
9. **risk_assessments** - Country-by-country risk levels
10. **civilian_safety** - Safety alerts and emergency info
11. **osint_posts** - Verified social media intelligence
12. **admin_users** - Admin authentication

## Automation Features

### RSS Feed Collection
- **Frequency**: Every 5-10 minutes (configurable)
- **Edge Function**: `collect-rss-feeds`
- **Features**:
  - Automatic categorization
  - Deduplication by source URL
  - Source tracking
  - Error handling and logging

### AI Summarization
- **Edge Function**: `summarize-articles`
- **Features**:
  - 2-3 sentence summaries
  - Automatic verification status assignment
  - Keyword-based relevance filtering
  - Batch processing

### Real-time Updates
- **Technology**: Supabase Realtime
- **Auto-refresh**: Every 5 minutes + instant updates
- **Tables Monitored**:
  - articles
  - escalation_levels
  - map_events
  - risk_assessments
  - osint_posts
  - civilian_safety

## Monetization Features

### Ad Placements
- Top banner (homepage and all pages)
- Sidebar ads
- Inline ads (between articles every 5 posts)
- Footer banner
- Ready for Google AdSense integration

## Performance Optimizations

- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**:
  - Supabase query caching
  - Real-time subscriptions for instant updates
- **Mobile Responsive**: Fully optimized for all device sizes
- **Dark Theme**: Reduces eye strain and battery usage on OLED screens

## Security Features

### Row Level Security (RLS)
- All tables protected with RLS policies
- Public read access for approved/active content only
- Admin-only write access
- Separate policies for authenticated users

### Data Verification
- Three-tier verification system (Confirmed, Developing, Unverified)
- Admin approval required for public display
- Source tracking for all information
- OSINT reliability scoring

## Future Enhancements (Ready to Integrate)

### Flight Tracking Integration
- Integration point: Intelligence Dashboard
- Suggested API: Flightradar24 or ADS-B Exchange
- Database: Add `flight_tracking` table

### Ship Tracking Integration
- Integration point: Intelligence Dashboard
- Suggested API: MarineTraffic or VesselFinder
- Database: Add `ship_tracking` table

### Satellite Imagery
- Integration point: Intelligence Dashboard
- Suggested Service: Sentinel Hub or Planet Labs
- Display: Embedded imagery with annotations

### Push Notifications
- Service: OneSignal (recommended) or Firebase CM
- Trigger: `alerts` table with `sent=false`
- Edge Function: Create `send-notifications` function

### Advanced Mapping
- Library: Mapbox GL JS or Leaflet
- Features: Pan, zoom, clustering, heatmaps
- Markers: Custom icons for different event types

## How to Use

### For Visitors
1. **Homepage** (`/`) - View live news feed with escalation meter
2. **Timeline** (`/timeline`) - Browse chronological event history
3. **Intelligence** (`/intelligence`) - Access full intelligence dashboard
4. **Briefing** (`/briefing`) - Read daily summaries
5. **Map** (`/map`) - View geographic conflict visualization
6. **Safety** (`/safety`) - Access emergency information

### For Administrators
1. **Admin Dashboard** (`/admin`)
2. Approve/reject incoming articles
3. Manually add breaking news
4. Edit article summaries
5. Manage verification statuses
6. Mark breaking news alerts

### Triggering Edge Functions

To manually collect RSS feeds:
```bash
curl -X POST https://[project-ref].supabase.co/functions/v1/collect-rss-feeds
```

To manually summarize articles:
```bash
curl -X POST https://[project-ref].supabase.co/functions/v1/summarize-articles
```

For production, set up Supabase Cron jobs to run these automatically.

## Design Philosophy

The platform uses a modern **intelligence dashboard** aesthetic:
- Dark theme (neutral-950 to black gradient)
- High-contrast color coding for threat levels
- Glassmorphic cards with backdrop blur
- Animated elements for live data
- Military situation room inspiration
- Clear visual hierarchy
- Accessible emergency information

## Mobile Optimization

- Responsive grid layouts
- Touch-friendly interfaces
- Optimized font sizes
- Collapsible navigation
- Fast load times
- Progressive Web App ready

## High Traffic Readiness

- Static generation for fast serving
- CDN-ready architecture (Netlify/Vercel)
- Database connection pooling via Supabase
- Efficient queries with proper indexing
- Real-time subscriptions scale automatically
- Serverless edge functions

---

**Platform Status**: Production Ready ✓
**Build Status**: Passing ✓
**Database**: Configured ✓
**Edge Functions**: Deployed ✓
**Mobile Responsive**: Yes ✓
**High Traffic Ready**: Yes ✓
