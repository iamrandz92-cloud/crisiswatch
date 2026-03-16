import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - CrisisWatch',
  description: 'Privacy policy and data collection practices for CrisisWatch',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-6 text-slate-300">
            <p className="text-sm text-slate-400">
              <strong>Last Updated:</strong> March 16, 2026
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
              <p>
                CrisisWatch is committed to protecting your privacy. This Privacy Policy explains how we collect,
                use, and safeguard information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <p>
                CrisisWatch collects limited information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>IP address (anonymized)</li>
              </ul>
              <p className="mt-4">
                This information is used solely to improve the user experience and functionality of the CrisisWatch platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Third-Party Services</h2>
              <p>
                This website uses cookies and third-party services including <strong>Google AdSense</strong> to
                display advertisements. Google may use cookies to serve ads based on a user&apos;s previous visits
                to this website or other websites.
              </p>
              <p className="mt-4">
                Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your
                visit to CrisisWatch and/or other sites on the internet.
              </p>
              <p className="mt-4">
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Google Ads Settings
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <p>
                The information we collect is used to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Improve website functionality and user experience</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide relevant content and safety information</li>
                <li>Display relevant advertisements through Google AdSense</li>
                <li>Detect and prevent fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Sharing</h2>
              <p>
                <strong>We do not sell personal information.</strong> Any data collected is used solely for
                improving the functionality and safety tools of the CrisisWatch platform.
              </p>
              <p className="mt-4">
                We may share anonymized, aggregated data with third-party analytics services to improve our
                service. These third parties are contractually obligated to keep your information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of personalized advertising</li>
                <li>Disable cookies in your browser settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no internet
                transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Children&apos;s Privacy</h2>
              <p>
                CrisisWatch is not intended for children under the age of 13. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by
                the &quot;Last Updated&quot; date at the top of this page. We encourage you to review this policy
                periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please contact us at:
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
