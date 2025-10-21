import { ImageResponse } from 'next/og';

// 路由处理程序
export const runtime = 'edge';

// 图片元数据
export const alt = '星尘网盘搜索';
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

// 图片生成函数
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#f3f4f6',
          backgroundImage:
            'linear-gradient(to bottom right, #f3f4f6 25%, #e5e7eb 50%, #d1d5db 75%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '60px',
              maxWidth: '800px',
              width: '100%',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              星尘网盘搜索
            </h1>
            <p
              style={{
                fontSize: '28px',
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: '1.4',
              }}
            >
              支持12种主流网盘资源搜索，快速找到您需要的资源
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}