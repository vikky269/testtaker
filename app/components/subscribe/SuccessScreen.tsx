// components/subscribe/SuccessScreen.tsx
export function SuccessScreen({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-[var(--font-outfit)]">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#7FB509]/10 flex items-center justify-center mx-auto mb-6"
          style={{ animation: 'pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
          <svg className="w-10 h-10 text-[#7FB509]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">You're enrolled! 🎉</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Thank you for joining SmartMathz. A confirmation email is on its way to <strong>{email}</strong>.
        </p>
        <a href="/" className="mt-8 inline-block bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition-colors shadow-sm">
          ← Back to Home
        </a>
      </div>
      <style>{`@keyframes pop { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }`}</style>
    </div>
  );
}