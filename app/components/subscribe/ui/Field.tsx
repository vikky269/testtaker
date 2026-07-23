// components/subscribe/ui/Field.tsx
import { type ReactNode } from 'react';

export function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}