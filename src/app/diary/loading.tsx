export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent-orange)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>일기 불러오는 중…</p>
      </div>
    </div>
  );
}
