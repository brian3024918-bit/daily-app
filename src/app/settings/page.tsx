'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { Moon, Sun, Download } from 'lucide-react';

function SettingsContent() {
  const { isDark, toggleDark } = useTheme();
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt?: () => Promise<void> } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt?: () => Promise<void> });
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt?.prompt) return;
    await deferredPrompt.prompt();
    setCanInstall(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">⚙️</span>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>설정</h1>
      </div>

      {/* 테마 */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            테마
          </h2>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark
              ? <Moon size={16} style={{ color: 'var(--accent-orange)' }} />
              : <Sun size={16} style={{ color: 'var(--accent-orange)' }} />}
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>다크 모드</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {isDark ? '다크 모드 사용 중' : '라이트 모드 사용 중'}
              </div>
            </div>
          </div>
          <button
            onClick={toggleDark}
            className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
            style={{
              backgroundColor: isDark ? 'var(--accent-orange)' : 'var(--bg-sidebar)',
              border: '1.5px solid var(--border-color)',
            }}
            aria-label="다크 모드 토글"
          >
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: isDark ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
        </div>
      </div>

      {/* PWA 설치 */}
      {canInstall && (
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              앱 설치
            </h2>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download size={16} style={{ color: 'var(--accent-orange)' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>홈 화면에 추가</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>앱처럼 바로 실행 가능</div>
              </div>
            </div>
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
            >
              설치
            </button>
          </div>
        </div>
      )}

      {/* 앱 정보 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            앱 정보
          </h2>
        </div>
        <div>
          {[
            { label: '버전', value: 'v0.8.0' },
            { label: 'PWA', value: '✦ 설치 지원', accent: true },
            { label: '데이터베이스', value: '✦ Supabase 연결됨', accent: true },
          ].map(({ label, value, accent }, i, arr) => (
            <div
              key={label}
              className="px-4 py-3 flex justify-between items-center"
              style={i < arr.length - 1 ? { borderBottom: '1px solid var(--border-color)' } : {}}
            >
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
              <span className="text-sm" style={{ color: accent ? '#A8D4B0' : 'var(--text-muted)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppLayout showInboxSidebar={false}>
      <SettingsContent />
    </AppLayout>
  );
}
