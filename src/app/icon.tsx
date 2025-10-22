import { ImageResponse } from 'next/og';

// 路由处理程序
export const runtime = 'edge';

// 启用 ISR 以获得静态生成的优势
export const revalidate = 3600; // 1小时缓存

// 图标元数据
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// 图标生成函数
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://so.dustpix.com/logo.png"
          alt="星尘网盘搜索 Logo"
          width="32"
          height="32"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}