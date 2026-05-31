'use client';

import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Classes input/textarea de base.
 *
 * Améliorations Phase 4 :
 *  - focus ring élargi (ring-2 ring-copper-500/15 + border-copper-500)
 *  - transition cubic-bezier(.22,1,.36,1) plus douce
 *  - aria-invalid → border red + ring red léger
 */
export const inputCls = cn(
  'w-full bg-transparent border border-ink/25 px-4 py-3 text-sm text-ink',
  'placeholder:text-ink/40',
  'focus:outline-none focus:border-copper-500 focus:ring-2 focus:ring-copper-500/15',
  'aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/10',
  'transition-all duration-300 ease-out-soft'
);

export const textareaCls = cn(inputCls, 'resize-none');

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
  help?: string;
  optionalLabel?: string;
}

/**
 * Wrapper standard amélioré :
 *  - label avec accent copper subtil au focus du champ (group-focus-within)
 *  - error animé : slide-in + icône AlertCircle
 *  - shake léger quand erreur apparaît (clé sur error → re-render motion)
 */
export function Field({ label, children, error, optional, help, optionalLabel = '(facultatif)' }: FieldProps) {
  return (
    <motion.div
      className="group"
      animate={error ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-3 transition-colors duration-200 group-focus-within:text-copper-500">
        {label}
        {optional && (
          <span className="ms-2 text-ink/30 normal-case tracking-normal">{optionalLabel}</span>
        )}
      </label>
      {help && <p className="text-xs text-ink/50 mb-3 -mt-2 leading-snug">{help}</p>}
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 flex items-start gap-1.5 text-xs text-red-600"
          >
            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Radio pills (légèrement enrichi avec scale spring au check) ───

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
          className={cn(
            'relative cursor-pointer border border-ink/25 px-4 py-3 text-sm text-center text-ink/75',
            'transition-all duration-300 ease-out-soft',
            'hover:border-ink hover:text-ink hover:-translate-y-0.5',
            'has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone-50',
            'has-[:checked]:shadow-card'
          )}
        >
          <input type="radio" value={o.value} {...register(name)} className="sr-only" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

// ─── Checkbox pills ────────────────────────────────────────────────

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
              'relative cursor-pointer border px-4 py-3 text-sm text-center',
              'transition-all duration-300 ease-out-soft hover:-translate-y-0.5',
              checked
                ? 'border-ink bg-ink text-bone-50 shadow-card'
                : 'border-ink/25 text-ink/75 hover:border-ink hover:text-ink'
            )}
          >
            <input type="checkbox" value={o.value} {...register(name)} className="sr-only" />
            <AnimatePresence>
              {checked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="absolute top-1.5 end-1.5 h-1.5 w-1.5 rounded-full bg-copper-500"
                />
              )}
            </AnimatePresence>
            {o.label}
          </label>
        );
      })}
    </div>
  );
}
