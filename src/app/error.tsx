'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 text-center space-y-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="text-4xl">⚠️</div>
        <div>
          <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            오류가 발생했어요
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            잠시 후 다시 시도해주세요.
          </p>
        </div>
        <button
          onClick={reset}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
