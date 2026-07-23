// components/subscribe/ui/Radio.tsx
import { inputCls } from '@/lib/subscribe/style';

export function Radio({ options, value, onChange, showOther, otherValue, onOtherChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
  showOther?: boolean; otherValue?: string; onOtherChange?: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all cursor-pointer
            ${value === opt
              ? 'border-[#7FB509] bg-[#7FB509]/5 text-[#3a5a09] font-semibold'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
            ${value === opt ? 'border-[#7FB509]' : 'border-gray-300'}`}>
            {value === opt && <div className="w-2 h-2 rounded-full bg-[#7FB509]" />}
          </div>
          {opt}
        </button>
      ))}
      {showOther && value === 'Other' && (
        <input type="text" placeholder="Please specify..."
          value={otherValue ?? ''} onChange={e => onOtherChange?.(e.target.value)}
          className={`${inputCls} mt-1`} />
      )}
    </div>
  );
}