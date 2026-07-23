// components/subscribe/StepSidebar.tsx
import { STEPS } from '@/lib/subscribe/constants';

export function StepSidebar({ currentStep }: { currentStep: number }) {
  return (
    <nav
      aria-label="Enrollment steps"
      className="md:w-[300px] flex-shrink-0 md:sticky md:top-6 md:self-start"
    >
      {/* Mobile: horizontal scroll strip. Desktop: vertical list. */}
      <ol className="flex md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-visible pb-1 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
        {STEPS.map((s, i) => {
          const isActive = s.num === currentStep;
          const isDone = s.num < currentStep;
          const isLast = i === STEPS.length - 1;

          return (
            <li key={s.num} className="relative flex-shrink-0 md:flex-shrink">
              <div
                className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 transition-colors
                  min-w-[220px] md:min-w-0
                  ${isActive ? 'bg-[#7FB509]/10' : ''}`}
              >
                <span className="flex flex-col items-center flex-shrink-0">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${isActive ? 'bg-[#7FB509] text-white' : isDone ? 'bg-[#7FB509]/20 text-[#3a5a09]' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {isDone ? '✓' : s.num}
                  </span>
                  {/* connecting line — desktop vertical list only */}
                  {!isLast && (
                    <span
                      className={`hidden md:block w-px flex-1 min-h-[26px] mt-1
                        ${isDone ? 'bg-[#7FB509]/40' : 'bg-gray-200'}`}
                    />
                  )}
                </span>
                <span className="pt-0.5">
                  <p className={`text-sm font-bold leading-tight ${isActive ? 'text-[#1a2e05]' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                    {s.title}
                  </p>
                  <p className={`text-xs mt-0.5 leading-snug ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                    {s.subtitle}
                  </p>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}