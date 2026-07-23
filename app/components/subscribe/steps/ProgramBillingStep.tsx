// components/subscribe/steps/ProgramBillingStep.tsx
import Link from 'next/link';
import ClipLoader from 'react-spinners/ClipLoader';
import { inputCls } from '@/lib/subscribe/style';
import { type Billing, type FormErrors, type Recommendation, type RecStatus } from '@/lib/subscribe/types';
import { Field } from '../ui/Field';
import { DaySelect } from '../ui/DaySelect';

export function ProgramBillingStep({ rec, recStatus, billing, setBilling, errors }: {
  rec: Recommendation | null;
  recStatus: RecStatus;
  billing: Billing;
  setBilling: React.Dispatch<React.SetStateAction<Billing>>;
  errors: FormErrors;
}) {
  const cp = rec?.computed_price;

  return (
    <>
      {recStatus === 'loading' && (
        <div className="flex flex-col items-center py-16 gap-3">
          <ClipLoader size={28} color="#7FB509" />
          <p className="text-sm text-gray-400">Loading your personalized program...</p>
        </div>
      )}

      {recStatus === 'nologin' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🔐</div>
          <h3 className="font-bold text-gray-900 mb-2">Please log in to continue</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
            Your personalized program is linked to your SmartMathz account — the one your child used for the
            evaluation test. Log in to see your recommended program and pricing.
          </p>
          <Link href="/login"
            className="inline-block bg-[#7FB509] hover:bg-[#6b970a] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
            Log In
          </Link>
        </div>
      )}

      {recStatus === 'none' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="font-bold text-gray-900 mb-2">Your personalized program is being prepared</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Our academic team is reviewing your child's evaluation results and preparing a tailored program
            recommendation. You'll receive an email as soon as it's ready — then you can return here to
            complete enrollment. If your child hasn't taken the evaluation yet, that's the first step!
          </p>
        </div>
      )}

      {recStatus === 'found' && rec && (
        <>
          {/* Recommendation card — read-only, set by the SmartMathz team */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="bg-[#1a2e05] text-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3d926] mb-0.5">
                Recommended for {rec.student_name}
              </p>
              <p className="font-bold text-lg">
                {rec.package_id === 'custom' ? 'Custom Package' : `Package ${rec.package_id}`}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                {rec.package_id === 'custom'
                  ? (rec.custom_subjects ?? []).map(s => s.name).join(' + ')
                  : rec.package_id === 'I'
                    ? 'Math Tutoring Only'
                    : `Math Tutoring${(rec.additional_programs ?? []).length ? ' + ' + (rec.additional_programs ?? []).join(' + ') : ''} + Virtual Library`}
              </p>
            </div>
            <div className="bg-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Sessions / Mo</p>
                <p className="font-bold text-gray-900">{rec.sessions ?? cp?.sessions ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Hourly Rate</p>
                <p className="font-bold text-gray-900">{cp ? `$${cp.smHourlyRate.toFixed(2)}` : '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Monthly</p>
                <p className="font-bold text-green-700 text-lg">{cp ? `$${cp.smMonthlyFee}` : '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Bi-Weekly</p>
                <p className="font-bold text-gray-900">{cp ? `$${cp.smBiweekly.toFixed(1)}` : '—'}</p>
              </div>
            </div>
            {cp && cp.savingsPercent > 0 && (
              <div className="bg-green-50 border-t border-green-100 px-5 py-2.5 text-center">
                <p className="text-xs font-bold text-green-700">
                  🎉 You're saving {cp.savingsPercent}% (${cp.smInvestment}/month) with your SmartMathz offer
                </p>
              </div>
            )}
          </div>

          {/* Billing frequency */}
          <Field label="Payment Frequency" required error={errors.billing}>
            <select
              value={billing.frequency}
              onChange={e => setBilling({ frequency: e.target.value as Billing['frequency'], mode: '', preferredDay: null, firstDay: null, secondDay: null })}
              className={`${inputCls} cursor-pointer`}>
              <option value="" disabled>Select how often you'd like to pay...</option>
              <option value="once">Once per month</option>
              <option value="twice">Twice per month</option>
            </select>
          </Field>

          {billing.frequency === 'once' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'standard', title: 'Standard', sub: 'Billed at the start of each period' },
                  { id: 'preferred', title: 'Preferred payment day', sub: 'Choose the day of the month you pay' },
                ].map(opt => (
                  <button key={opt.id} type="button"
                    onClick={() => setBilling(b => ({ ...b, mode: opt.id as Billing['mode'], preferredDay: opt.id === 'standard' ? null : b.preferredDay }))}
                    className={`text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer
                      ${billing.mode === opt.id
                        ? 'border-[#7FB509] bg-[#7FB509]/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <p className={`text-sm font-bold ${billing.mode === opt.id ? 'text-[#3a5a09]' : 'text-gray-800'}`}>{opt.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
              {billing.mode === 'preferred' && (
                <DaySelect value={billing.preferredDay}
                  onChange={d => setBilling(b => ({ ...b, preferredDay: d }))}
                  placeholder="Select your preferred payment day..." />
              )}
            </div>
          )}

          {billing.frequency === 'twice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="First Payment Day" required>
                <DaySelect value={billing.firstDay}
                  onChange={d => setBilling(b => ({ ...b, firstDay: d }))}
                  placeholder="Select first payment day..." />
              </Field>
              <Field label="Second Payment Day" required>
                <DaySelect value={billing.secondDay}
                  onChange={d => setBilling(b => ({ ...b, secondDay: d }))}
                  placeholder="Select second payment day..." />
              </Field>
            </div>
          )}
        </>
      )}
    </>
  );
}