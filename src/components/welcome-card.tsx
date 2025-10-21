'use client';

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface WelcomeCardProps {
  onCheckHealth: () => void;
  healthCheckLoading: boolean;
}

export const WelcomeCard = memo(({ onCheckHealth, healthCheckLoading }: WelcomeCardProps): React.JSX.Element => {
  return (
    <Card className="text-center p-8 sm:p-12 shadow-xl backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl">
      <div className="text-4xl sm:text-6xl mb-4">✨</div>
      <CardHeader className="p-0">
        <CardTitle className="text-xl sm:text-2xl mb-3">欢迎使用星尘网盘搜索</CardTitle>
        <CardDescription className="max-w-md mx-auto text-sm sm:text-base">
          输入关键词搜索各类网盘资源，支持百度网盘、阿里云盘、夸克网盘等多种资源
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-8">
        <Button
          onClick={onCheckHealth}
          disabled={healthCheckLoading}
          variant="outline"
          className="bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white rounded-xl"
        >
          {healthCheckLoading ? '检查中...' : '检查服务状态'}
        </Button>
      </CardContent>
    </Card>
  );
});

WelcomeCard.displayName = 'WelcomeCard';