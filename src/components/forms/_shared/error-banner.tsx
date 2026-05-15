'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  body?: string;
  detail?: string;
}

export function ErrorBanner({ title, body, detail }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 p-4 border border-red-500/40 bg-red-50/60 text-sm">
      <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-red-800">{title ?? 'Envoi échoué.'}</p>
        {body && <p className="text-red-700 mt-1">{body}</p>}
        {detail && <p className="text-red-600/70 mt-2 text-xs break-words">({detail})</p>}
      </div>
    </div>
  );
}
