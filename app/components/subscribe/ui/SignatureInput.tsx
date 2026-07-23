// components/subscribe/ui/SignatureInput.tsx
import { signatureFont } from '@/lib/subscribe/style';

export function SignatureInput({ value, onChange, error }: {
  value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="bg-white border border-gray-200 rounded-xl px-5 pt-3 pb-2 focus-within:ring-2 focus-within:ring-[#7FB509]/30 focus-within:border-[#7FB509] transition-all">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Electronic Signature — type your full name</p>
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder="Your full name"
          className={`${signatureFont.className} w-full text-3xl text-gray-800 outline-none bg-transparent
                      border-b-2 border-dashed border-gray-300 focus:border-[#7FB509] py-1 placeholder:text-gray-300`}
        />
        <p className="text-[11px] text-gray-400 mt-1.5">
          Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}