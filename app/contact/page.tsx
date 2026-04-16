import { Metadata } from 'next'
import { Mail, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - CrisisWatch',
  description: 'Get in touch with the CrisisWatch team',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-xl text-slate-400 mb-12">
          Have questions, feedback, or safety information to share? We&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Email Us</h2>
            </div>
            <p className="text-slate-300 mb-4">
              For general inquiries, feedback, or support:
            </p>
            <a
              href="mailto:crisiswatchsupport@gmail.com"
              className="text-lg text-blue-400 hover:text-blue-300 underline break-all"
            >
              crisiswatchsupport@gmail.com
            </a>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Report Information</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Have critical safety or conflict information to share?
            </p>
            <p className="text-slate-400 text-sm">
              Please include relevant details such as location, time, and source verification when possible.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">About CrisisWatch</h2>
          <p className="text-slate-300 leading-relaxed">
            CrisisWatch is a real-time intelligence platform providing comprehensive coverage of global conflicts,
            humanitarian crises, and geopolitical developments. We aggregate information from verified sources
            to help decision-makers, journalists, and concerned citizens stay informed about critical global events.
          </p>
          <p className="text-slate-300 leading-relaxed mt-4">
            Our platform combines live news feeds, market impact analysis, interactive mapping, and predictive
            intelligence to provide a complete picture of developing situations around the world.
          </p>
        </div>

        <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
          <p className="text-amber-200 text-sm">
            <strong>Response Time:</strong> We aim to respond to all inquiries within 24-48 hours.
            For urgent safety concerns, please also contact local authorities or emergency services.
          </p>
        </div>
      </div>
    </div>
  )
}
