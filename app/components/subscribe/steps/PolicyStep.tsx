// components/subscribe/steps/PolicyStep.tsx
import { POLICY_SECTIONS } from '@/lib/subscribe/policyContent';
import { SignatureInput } from '../ui/SignatureInput';

export function PolicyStep({
  policyAgreed, onPolicyAgreedChange,
  policySignature, onPolicySignatureChange,
  error, signatureError,
}: {
  policyAgreed: boolean; onPolicyAgreedChange: (v: boolean) => void;
  policySignature: string; onPolicySignatureChange: (v: string) => void;
  error?: string; signatureError?: string;
}) {
  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">SmartMathz Student & Parent Guidelines</h2>
        <p className="text-sm text-gray-500 mb-5">
          Welcome to SmartMathz! Our goal is to create a positive, engaging, and respectful learning environment
          where every student can thrive. The following guidelines help ensure that students, parents, and tutors
          have the best possible experience together.
        </p>
        <div className="space-y-5">
          {POLICY_SECTIONS.map(sec => (
            <div key={sec.title}>
              <h3 className="text-sm font-bold text-[#1a2e05] mb-1.5">{sec.title}</h3>
              {sec.intro && <p className="text-sm text-gray-600 leading-relaxed mb-1.5">{sec.intro}</p>}
              {sec.items && (
                <ul className="space-y-1 ml-1">
                  {sec.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                      <span className="text-[#7FB509] font-bold mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {sec.outro && <p className="text-sm text-gray-600 leading-relaxed mt-1.5">{sec.outro}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className={`bg-white border rounded-2xl p-5 shadow-sm ${error ? 'border-red-300' : 'border-gray-100'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={policyAgreed}
            onChange={e => onPolicyAgreedChange(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 accent-[#7FB509] cursor-pointer" />
          <span className="text-sm text-gray-700 leading-relaxed">
            I have read and understand the SmartMathz Student & Parent Guidelines. I agree to support these
            expectations to help create a positive and productive learning experience for my child.
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <div className="mt-4">
          <SignatureInput value={policySignature} onChange={onPolicySignatureChange} error={signatureError} />
        </div>
      </div>
    </>
  );
}