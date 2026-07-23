// components/subscribe/ui/DaySelect.tsx
import { useEffect, useState } from 'react';
import { inputCls } from '@/lib/subscribe/style';
import { ord } from '@/lib/subscribe/constants';

export function DaySelect({ value, onChange, placeholder }: {
  value: number | null; onChange: (v: number) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<number | null>(value);

  // Reset the in-progress selection whenever the popover opens
  useEffect(() => { if (open) setTemp(value); }, [open, value]);

  const confirm = () => {
    if (temp) onChange(temp);
    setOpen(false);
  };

  const displayLabel = value ? `${value}${ord(value)} of the month` : placeholder;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${inputCls} cursor-pointer text-left flex items-center justify-between gap-2`}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>{displayLabel}</span>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md flex flex-col sm:flex-row"
            onClick={e => e.stopPropagation()}
          >
            {/* Left panel — big preview of the current selection */}
            <div className="bg-[#1a2e05] text-white p-6 sm:w-[38%] flex sm:flex-col justify-between items-end sm:items-start gap-2">
              <div>
                <p className="text-[10px] text-[#a3d926] font-bold uppercase tracking-widest mb-1">Payment Day</p>
                <p className="text-5xl font-bold leading-none">{temp ? `${temp}${ord(temp)}` : '—'}</p>
                <p className="text-white/50 text-xs mt-2">of every month</p>
              </div>
            </div>

            {/* Right panel — day grid */}
            <div className="p-5 flex-1">
              <div className="grid grid-cols-7 gap-1.5 max-h-64 overflow-y-auto pr-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTemp(d)}
                    className={`w-9 h-9 rounded-full text-sm font-semibold flex items-center justify-center transition-all cursor-pointer
                      ${temp === d ? 'bg-[#7FB509] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setTemp(null)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer tracking-wide"
                >
                  CLEAR
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-xs font-bold text-gray-500 hover:bg-gray-50 px-3 py-2 rounded-lg cursor-pointer tracking-wide"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={confirm}
                    disabled={!temp}
                    className="text-xs font-bold text-[#3a5a09] hover:bg-[#7FB509]/10 px-3 py-2 rounded-lg cursor-pointer
                               tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}