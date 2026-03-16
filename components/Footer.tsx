import Link from 'next/link';
import { Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto" style={{ background: '#0f1217', borderColor: '#1e293b' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">CrisisWatch</h3>
            <p className="text-sm text-slate-400">
              Real-time global intelligence platform for conflict tracking and crisis analysis
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Live Feed
                </Link>
              </li>
              <li>
                <Link href="/markets" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Crisis Map
                </Link>
              </li>
              <li>
                <Link href="/intelligence" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Intelligence
                </Link>
              </li>
              <li>
                <Link href="/briefing" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Daily Briefing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <a
              href="mailto:crisiswatchsupport@gmail.com"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
            >
              <Mail className="w-4 h-4" />
              crisiswatchsupport@gmail.com
            </a>
            <p className="text-xs text-slate-500 mt-4">
              For emergency situations, contact local authorities immediately
            </p>
          </div>
        </div>

        <div className="pt-6 border-t" style={{ borderColor: '#1e293b' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} CrisisWatch. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
