import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - CrisisWatch',
  description: 'Terms of service and usage guidelines for CrisisWatch',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-6 text-slate-300">
            <p className="text-sm text-slate-400">
              <strong>Last Updated:</strong> March 16, 2026
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using CrisisWatch, you accept and agree to be bound by the terms and
                provisions of this agreement. If you do not agree to these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                CrisisWatch provides real-time intelligence and information about global conflicts, humanitarian
                crises, market impacts, and geopolitical developments. The service aggregates information from
                multiple sources for analysis and situational awareness purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Accuracy</h2>
              <p>
                While we strive to provide accurate and up-to-date information through multi-source verification:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Information is provided &quot;as is&quot; without warranties of any kind</li>
                <li>We do not guarantee the accuracy, completeness, or timeliness of any information</li>
                <li>Information in active conflict zones may be fluid and uncertain</li>
                <li>Users should verify critical information through official sources</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Appropriate Use</h2>
              <p>
                You agree to use CrisisWatch only for lawful purposes and in accordance with these Terms.
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Reproduce, duplicate, or copy content without authorization</li>
                <li>Misrepresent information obtained from CrisisWatch</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are owned by CrisisWatch
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-4">
                Information sourced from third parties remains the property of those parties and is used
                under fair use provisions for news aggregation and analysis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                CrisisWatch, its officers, directors, employees, or agents shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or use of (or inability to access or use) the service</li>
                <li>Any decisions made based on information provided by the service</li>
                <li>Any errors or omissions in any content</li>
                <li>Any unauthorized access to or use of our servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Emergency Situations</h2>
              <p>
                <strong>CrisisWatch is not an emergency service.</strong> In case of immediate danger or
                emergency situations, always contact local authorities, emergency services, or appropriate
                governmental agencies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Links and Services</h2>
              <p>
                Our service may contain links to third-party websites or services. We are not responsible
                for the content, privacy policies, or practices of any third-party sites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Advertising</h2>
              <p>
                CrisisWatch displays advertisements through Google AdSense and other advertising partners.
                These third parties may use cookies and similar technologies to collect information about
                your browsing activities. See our Privacy Policy for more details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material,
                we will provide at least 30 days&apos; notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Termination</h2>
              <p>
                We may terminate or suspend access to our service immediately, without prior notice or
                liability, for any reason, including breach of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, without
                regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <a
                  href="mailto:crisiswatchsupport@gmail.com"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  crisiswatchsupport@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
