'use client';

import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

/**
 * Champ "miroir" invisible aux humains : un bot qui remplit tous les champs sera détecté.
 * À placer dans chaque formulaire avec name="hp_field".
 */
export function Honeypot<T extends FieldValues>({ register }: { register: UseFormRegister<T> }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label>
        Ne pas remplir
        <input
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
          data-1p-ignore
          data-lpignore="true"
          {...register('hp_field' as Path<T>)}
        />
      </label>
    </div>
  );
}
