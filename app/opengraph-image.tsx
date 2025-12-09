import { ImageResponse } from 'next/og';

export const alt = 'Portfolio de Paul Viandier - Développeur Web & Cybersécurité';
export const size = {
    width: 1200,
    height: 630
};
export const contentType = 'image/png';

export const runtime = 'nodejs';

export default async function Image() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://paulviandier.com';
        const localUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : baseUrl;
        
        const bannerResponse = await fetch(`${localUrl}/banner.png`, {
            cache: 'no-store'
        });
        
        if (!bannerResponse.ok) {
            throw new Error('Failed to fetch banner');
        }

        const bannerBuffer = await bannerResponse.arrayBuffer();
        const bannerBase64 = Buffer.from(bannerBuffer).toString('base64');
        const bannerDataUrl = `data:image/png;base64,${bannerBase64}`;

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        position: 'relative'
                    }}
                >
                    <img
                        src={bannerDataUrl}
                        alt="Banner"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            ),
            {
                ...size
            }
        );
    } catch (error) {
        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        padding: '80px'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.2), transparent 60%)',
                            opacity: 0.8
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            gap: 32,
                            zIndex: 1,
                            flex: 1,
                            maxWidth: '700px'
                        }}
                    >
                        <div
                            style={{
                                fontSize: 84,
                                fontWeight: 'bold',
                                color: '#ffffff',
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em',
                                marginBottom: 12
                            }}
                        >
                            Paul Viandier
                        </div>
                        <div
                            style={{
                                fontSize: 42,
                                color: '#e0e0e0',
                                fontWeight: 500,
                                lineHeight: 1.3,
                                marginBottom: 8
                            }}
                        >
                            Développeur Web & Cybersécurité
                        </div>
                        <div
                            style={{
                                fontSize: 28,
                                color: '#888888',
                                marginTop: 8,
                                fontWeight: 400,
                                display: 'flex',
                                gap: 16,
                                flexWrap: 'wrap'
                            }}
                        >
                            <span>Portfolio</span>
                            <span>•</span>
                            <span>Fullstack</span>
                            <span>•</span>
                            <span>Next.js</span>
                            <span>•</span>
                            <span>TypeScript</span>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
                            border: '4px solid rgba(59, 130, 246, 0.5)',
                            boxShadow: '0 0 60px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        <div
                            style={{
                                fontSize: 120,
                                color: '#ffffff',
                                fontWeight: 'bold'
                            }}
                        >
                            PV
                        </div>
                    </div>
                </div>
            ),
            {
                ...size
            }
        );
    }
}