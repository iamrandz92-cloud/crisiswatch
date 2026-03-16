import { Metadata } from 'next'
import { Shield, Globe, TrendingUp, Users, TriangleAlert as AlertTriangle, Map } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About CrisisWatch - Real-Time Global Intelligence Platform',
  description: 'Learn about CrisisWatch, a comprehensive platform for tracking global conflicts, humanitarian crises, and market impacts',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">About CrisisWatch</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Real-time intelligence platform providing comprehensive coverage of global conflicts,
            humanitarian crises, and their economic impacts
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6">Our Mission</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">
            CrisisWatch was created to bridge the gap between fragmented crisis information and actionable
            intelligence. In a world where conflicts, humanitarian emergencies, and geopolitical tensions
            can escalate rapidly, having access to verified, real-time information is critical for
            decision-makers, journalists, humanitarian workers, and concerned citizens.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed">
            We aggregate and analyze information from thousands of verified sources worldwide, providing
            a comprehensive view of developing situations and their potential impacts on markets, security,
            and humanitarian conditions.
          </p>
        </div>

        <h2 className="text-3xl font-semibold text-white mb-8 text-center">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Live Intelligence Feed</h3>
            <p className="text-slate-400">
              Real-time updates from verified news sources, social media intelligence, and on-ground reports
              covering conflicts and crises worldwide.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Market Impact Analysis</h3>
            <p className="text-slate-400">
              Track how global conflicts affect financial markets, commodity prices, defense stocks,
              and economic indicators in real-time.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <div className="p-3 bg-red-500/10 rounded-lg w-fit mb-4">
              <Map className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Interactive Mapping</h3>
            <p className="text-slate-400">
              Visualize conflict zones, humanitarian corridors, military movements, and risk zones on
              interactive global maps with live updates.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-4">
              <AlertTriangle className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Threat Prediction</h3>
            <p className="text-slate-400">
              AI-powered analysis to predict escalation risks, humanitarian needs, and potential
              flashpoints based on historical patterns and current data.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-4">
              <Users className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Humanitarian Tracking</h3>
            <p className="text-slate-400">
              Monitor civilian casualties, displacement, aid operations, and humanitarian access in
              conflict zones with verified reporting.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <div className="p-3 bg-cyan-500/10 rounded-lg w-fit mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Source Verification</h3>
            <p className="text-slate-400">
              Every piece of information is cross-referenced and verified through multiple sources
              to ensure accuracy and reliability.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6">Who Uses CrisisWatch</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Professionals</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Journalists covering international affairs</li>
                <li>• Security analysts and risk consultants</li>
                <li>• Humanitarian organizations and NGOs</li>
                <li>• Government and diplomatic personnel</li>
                <li>• Financial analysts and traders</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Organizations</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• International corporations with global operations</li>
                <li>• Investment firms and hedge funds</li>
                <li>• Research institutions and think tanks</li>
                <li>• Travel and security companies</li>
                <li>• Educational institutions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6">Data Sources</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            CrisisWatch aggregates information from over 100 verified sources including:
          </p>
          <ul className="text-slate-300 space-y-2">
            <li>• Major international news agencies (Reuters, AP, AFP, BBC)</li>
            <li>• Regional news outlets and local reporters</li>
            <li>• Open-source intelligence (OSINT) platforms</li>
            <li>• Verified social media accounts from conflict zones</li>
            <li>• Government and military announcements</li>
            <li>• Humanitarian organizations and UN agencies</li>
            <li>• Financial market data providers</li>
            <li>• Satellite imagery and geospatial intelligence</li>
          </ul>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-amber-200 mb-4">Disclaimer</h2>
          <p className="text-amber-100 leading-relaxed">
            CrisisWatch provides information for situational awareness and analysis purposes. While we
            strive for accuracy through multi-source verification, information in active conflict zones
            can be fluid and uncertain. This platform should not be used as the sole basis for critical
            decisions. Always consult official sources and local authorities for emergency situations.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Get in Touch</h2>
          <p className="text-slate-300 mb-6">
            Have questions, feedback, or partnership inquiries?
          </p>
          <a
            href="mailto:crisiswatchsupport@gmail.com"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
