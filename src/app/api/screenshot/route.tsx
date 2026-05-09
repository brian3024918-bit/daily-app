import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const form = searchParams.get('form') ?? 'narrow'; // 'wide' | 'narrow'

  const W = form === 'wide' ? 1280 : 390;
  const H = form === 'wide' ? 800 : 844;

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: '#F5F0E8',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            background: '#FDFAF4',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E0D8CC',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: '#2C2416' }}>Daily</span>
          <span style={{ fontSize: 14, color: '#8B7E6E' }}>2026년 5월</span>
        </div>

        {/* 캘린더 그리드 미리보기 */}
        <div
          style={{
            flex: 1,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {/* 요일 헤더 */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div
                key={d}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  color: i === 0 ? '#E8786A' : i === 6 ? '#A8C8E8' : '#8B7E6E',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 행 샘플 */}
          {[[null, null, null, null, 1, 2, 3], [4, 5, 6, 7, 8, 9, 10], [11, 12, 13, 14, 15, 16, 17]].map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 4 }}>
              {row.map((d, ci) => (
                <div
                  key={ci}
                  style={{
                    flex: 1,
                    height: 52,
                    background: d === 9 ? '#E8A87C' : '#FDFAF4',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    padding: '6px 8px',
                    border: '1px solid #E0D8CC',
                  }}
                >
                  {d && (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: d === 9 ? 700 : 500,
                        color: d === 9 ? '#fff' : ci === 0 ? '#E8786A' : '#2C2416',
                      }}
                    >
                      {d}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* 할일 카드 샘플 */}
          <div
            style={{
              background: '#FDFAF4',
              borderRadius: 12,
              padding: '12px 16px',
              marginTop: 8,
              border: '1px solid #E0D8CC',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8B7E6E' }}>오늘 할 일</span>
            {['디자인 시안 검토', '팀 미팅 준비'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: `2px solid ${i === 0 ? '#E8A87C' : '#A8D4B0'}`,
                    display: 'flex',
                  }}
                />
                <span style={{ fontSize: 13, color: '#2C2416' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
