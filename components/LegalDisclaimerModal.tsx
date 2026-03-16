'use client';

interface LegalDisclaimerModalProps {
  onAccept: () => void;
}

export function LegalDisclaimerModal({ onAccept }: LegalDisclaimerModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
      <div className="max-w-lg w-full p-8 rounded-2xl" style={{ background: '#0f1217', border: '1px solid #1e293b' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#ff4d4d' }}>
          ⚠️ Legal Disclaimer
        </h2>

        <p className="mb-4 leading-relaxed" style={{ color: '#8892a0' }}>
          This website aggregates real-time information about the Iran-US-Israel conflict from various news sources. All information should be independently verified.
        </p>

        <p className="font-bold mb-2" style={{ color: '#8892a0' }}>Important:</p>
        <p className="mb-2" style={{ color: '#8892a0' }}>• Information is provided for informational purposes only</p>
        <p className="mb-2" style={{ color: '#8892a0' }}>• We are not responsible for the accuracy of third-party content</p>
        <p className="mb-2" style={{ color: '#8892a0' }}>• Some content may contain sensitive material</p>
        <p className="mb-6" style={{ color: '#8892a0' }}>• By proceeding, you acknowledge these terms</p>

        <button
          onClick={onAccept}
          className="w-full py-4 px-8 rounded-lg text-lg font-medium transition-colors hover:bg-red-600"
          style={{ background: '#ff4d4d', color: 'white' }}
        >
          I Understand & Proceed
        </button>
      </div>
    </div>
  );
}
