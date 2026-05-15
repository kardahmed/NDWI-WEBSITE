'use client';

import { cn } from '@/lib/utils';

export const inputCls =
  'w-full bg-transparent border border-ink/15 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-colors';

export const textareaCls = cn(inputCls, 'resize-none');

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
  help?: string;
  optionalLabel?: string;
}

/** Wrapper standard : label uppercase + tracker + zone de saisie + message d'erreur. */
export function Field({ label, children, error, optional, help, optionalLabel = '(facultatif)' }: FieldProps) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-3">
        {label}
        {optional && <span className="ms-2 text-ink/30 normal-case tracking-normal">{optionalLabel}</span>}
      </label>
      {help && <p className="text-xs text-ink/50 mb-3 -mt-2">{help}</p>}
      {children}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** Groupe de boutons radio "pills" stylé sans `appearance-none` natif. */
interface RadioPillsProps<T extends string> {
  name: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  register: (name: string) => Record<string, unknown>;
  columns?: 2 | 3 | 4;
}

export function RadioPills<T extends string>({ name, options, register, columns = 2 }: RadioPillsProps<T>) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[columns];
  return (
    <div className={cn('grid gap-2', cols)}>
      {options.map((o) => (
        <label
          key={o.value}
          className="cursor-pointer border border-ink/15 px-4 py-3 text-sm text-center hover:border-ink/40 transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone-50"
        >
          <input type="radio" value={o.value} {...register(name)} className="sr-only" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

/** Groupe de checkboxes "pills". */
interface CheckboxPillsProps<T extends string> {
  name: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  register: (name: string) => Record<string, unknown>;
  selected: T[];
  columns?: 2 | 3 | 4;
}

export function CheckboxPills<T extends string>({ name, options, register, selected, columns = 3 }: CheckboxPillsProps<T>) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[columns];
  return (
    <div className={cn('grid gap-2', cols)}>
      {options.map((o) => {
        const checked = selected.includes(o.value);
        return (
          <label
            key={o.value}
            className={cn(
              'relative cursor-pointer border px-4 py-3 text-sm text-center transition-colors',
              checked ? 'border-ink bg-ink text-bone-50' : 'border-ink/15 text-ink/70 hover:border-ink/40'
            )}
          >
            <input type="checkbox" value={o.value} {...register(name)} className="sr-only" />
            {checked && <span className="absolute top-1.5 end-1.5 h-1.5 w-1.5 rounded-full bg-copper-500" />}
            {o.label}
          </label>
        );
      })}
    </div>
  );
}
