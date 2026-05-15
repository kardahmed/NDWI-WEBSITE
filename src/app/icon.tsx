import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          fontSize: 36,
          fontWeight: 300,
          color: '#F5F2EE',
          letterSpacing: '-0.02em',
        }}
      >
        N<span style={{ color: '#B8651A' }}>.</span>
      </div>
    ),
    { ...size }
  );
}
