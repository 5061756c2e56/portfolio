import { ImageResponse } from 'next/og';

export const alt = 'Portfolio de Paul Viandier - Développeur Web & Cybersécurité';
export const size = {
    width: 1200,
    height: 630
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.15), transparent 70%)',
                        opacity: 0.6
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 24,
                        zIndex: 1,
                        padding: '60px 80px',
                        textAlign: 'center'
                    }}
                >
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 'bold',
                            color: '#ffffff',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            marginBottom: 8
                        }}
                    >
                        Paul Viandier
                    </div>
                    <div
                        style={{
                            fontSize: 36,
                            color: '#a0a0a0',
                            fontWeight: 400,
                            lineHeight: 1.3
                        }}
                    >
                        Développeur Web & Cybersécurité
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            color: '#666666',
                            marginTop: 16,
                            fontWeight: 300
                        }}
                    >
                        Portfolio • Fullstack • Next.js • TypeScript
                    </div>
                </div>
            </div>
        ),
        {
            ...size
        }
    );
}