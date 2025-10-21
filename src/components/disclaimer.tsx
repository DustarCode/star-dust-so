'use client';

import React, { memo } from 'react';

export const Disclaimer = memo((): React.JSX.Element => {
  return (
    <div className="py-6 bg-white/20 dark:bg-black/20 border-t border-white/20 mt-auto backdrop-blur-xl rounded-t-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center text-sm text-muted-foreground">
          <h3 className="font-bold text-base mb-2">免责声明</h3>
          <p className="mb-2">
            本站资源均来源于网络，仅供学习交流使用，严禁商业用途。我们不存储任何文件，仅提供搜索服务。
            使用本站即表示您同意遵守相关法律法规，由此产生的责任与本站无关。
          </p>
          <p className="mb-2">
            资源版权归原作者所有，建议24小时内删除，支持正版。
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} 星尘网盘搜索. 保留所有权利.
          </p>
        </div>
      </div>
    </div>
  );
});

Disclaimer.displayName = 'Disclaimer';