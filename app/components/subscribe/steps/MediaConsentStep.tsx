// components/subscribe/steps/MediaConsentStep.tsx
import { SignatureInput } from '../ui/SignatureInput';

export function MediaConsentStep({
  mediaConsent, onMediaConsentChange,
  mediaSignature, onMediaSignatureChange,
  signatureError,
}: {
  mediaConsent: boolean; onMediaConsentChange: (v: boolean) => void;
  mediaSignature: string; onMediaSignatureChange: (v: string) => void;
  signatureError?: string;
}) {
  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">📸 Optional Media Consent</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          At SmartMathz, we love celebrating our students' learning journey. From time to time, we may take photos
          or short videos during tutoring sessions, workshops, or special events to showcase student engagement
          and achievements. With your permission, images or videos that include your child may be used for:
        </p>
        <ul className="space-y-1.5 mb-4">
          {[
            'Documenting classes, activities, and special events.',
            'Sharing student achievements and learning experiences.',
            'Promoting SmartMathz through our website, social media, newsletters, and other marketing materials.',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
              <span className="text-[#7FB509] font-bold mt-0.5 flex-shrink-0">•</span>{item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your child's privacy is important to us. All images and videos will be used responsibly and only for the
          purposes outlined above. If you believe any image has been used inappropriately, please contact us immediately.
        </p>
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 font-medium">
          This consent is completely optional and is not required for your child's enrollment or participation in
          the SmartMathz program. You may skip this step.
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={mediaConsent}
            onChange={e => onMediaConsentChange(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 accent-[#7FB509] cursor-pointer" />
          <span className="text-sm text-gray-700 leading-relaxed">
            I give SmartMathz permission to photograph or record my child and use these images/videos for the
            educational and promotional purposes described above. <span className="text-gray-400">(Optional)</span>
          </span>
        </label>
        {mediaConsent && (
          <div className="mt-4">
            <SignatureInput value={mediaSignature} onChange={onMediaSignatureChange} error={signatureError} />
          </div>
        )}
      </div>
    </>
  );
}