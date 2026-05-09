import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') ?? '192');

  const r = size * 0.208;  // corner radius
  const pad = size * 0.1;
  const barH = size * 0.073;
  const barR = size * 0.031;
  const barY = size * 0.25;
  const dotR = size * 0.083;
  const col1X = size * 0.292;
  const col2X = size * 0.5;
  const col3X = size * 0.708;
  const row1Y = size * 0.453;
  const row2Y = size * 0.609;
  const row3Y = size * 0.766;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F0E8',
          borderRadius: r,
        }}
      >
        {/* 내부 카드 */}
        <div
          style={{
            position: 'absolute',
            top: pad,
            left: pad,
            right: pad,
            bottom: pad,
            background: '#FDFAF4',
            borderRadius: r * 0.7,
            display: 'flex',
          }}
        />

        {/* 상단 오렌지 바 */}
        <div
          style={{
            position: 'absolute',
            top: barY,
            left: size * 0.188,
            width: size * 0.625,
            height: barH,
            background: '#E8A87C',
            borderRadius: barR,
            display: 'flex',
          }}
        />

        {/* 도트 그리드 3×3 */}
        {[
          { cx: col1X, cy: row1Y, color: '#E8A87C' },
          { cx: col2X, cy: row1Y, color: '#E0D8CC' },
          { cx: col3X, cy: row1Y, color: '#E0D8CC' },
          { cx: col1X, cy: row2Y, color: '#E0D8CC' },
          { cx: col2X, cy: row2Y, color: '#A8D4B0' },
          { cx: col3X, cy: row2Y, color: '#E0D8CC' },
          { cx: col1X, cy: row3Y, color: '#E0D8CC' },
          { cx: col2X, cy: row3Y, color: '#A8C8E8' },
          { cx: col3X, cy: row3Y, color: '#E0D8CC' },
        ].map(({ cx, cy, color }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: cy - dotR,
              left: cx - dotR,
              width: dotR * 2,
              height: dotR * 2,
              background: color,
              borderRadius: '50%',
              display: 'flex',
            }}
          />
        ))}
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
