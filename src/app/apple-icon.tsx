import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 100,
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
