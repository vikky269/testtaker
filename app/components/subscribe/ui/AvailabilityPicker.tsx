// components/subscribe/ui/AvailabilityPicker.tsx
import { DAYS, TIME_OPTIONS } from '@/lib/subscribe/constants';
import { type AvailabilitySlot } from '@/lib/subscribe/types';

export function AvailabilityPicker({ slots, onChange }: {
  slots: AvailabilitySlot[]; onChange: (slots: AvailabilitySlot[]) => void;
}) {
  const selectedDays = slots.map(s => s.day);
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) onChange(slots.filter(s => s.day !== day));
    else onChange([...slots, { day, from: '3:00 PM', to: '5:00 PM' }]);
  };
  const updateSlot = (day: string, field: 'from' | 'to', value: string) =>
    onChange(slots.map(s => s.day === day ? { ...s, [field]: value } : s));
  const removeDay = (day: string) => onChange(slots.filter(s => s.day !== day));
  const orderedSlots = DAYS.map(day => slots.find(s => s.day === day))
    .filter((s): s is AvailabilitySlot => !!s);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
        {DAYS.map(day => {
          const isSelected = selectedDays.includes(day);
          return (
            <button key={day} type="button" onClick={() => toggleDay(day)}
              className={`px-2 py-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all
                ${isSelected
                  ? 'border-[#7FB509] bg-[#7FB509] text-white shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>
      {orderedSlots.length > 0 ? (
        <div className="space-y-2 pt-1">
          {orderedSlots.map(slot => (
            <div key={slot.day}
              className="flex items-center gap-2 bg-[#7FB509]/5 border border-[#7FB509]/20 rounded-xl px-3 py-2.5">
              <span className="text-sm font-semibold text-[#3a5a09] w-20 flex-shrink-0">{slot.day}</span>
              <select value={slot.from} onChange={e => updateSlot(slot.day, 'from', e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30">
                {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
              <span className="text-xs text-gray-400 flex-shrink-0">to</span>
              <select value={slot.to} onChange={e => updateSlot(slot.day, 'to', e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30">
                {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
              <button type="button" onClick={() => removeDay(slot.day)}
                className="text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors">
                ✕
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-400 pt-1">All times shown are Eastern Time (ET).</p>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic px-1">Select one or more days above to set time slots.</p>
      )}
    </div>
  );
}