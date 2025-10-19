'use client';

import { useState, useEffect } from 'react';
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function HeaderControls() {
  const [apiStatus, setApiStatus] = useState<{status: string, message?: string} | null>(null);
  const [healthCheckLoading, setHealthCheckLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  // 检查API健康状态
  const checkApiHealth = async () => {
    setHealthCheckLoading(true);
    try {
      const response = await fetch('/api/search');
      if (response.ok) {
        const data = await response.json();
        setApiStatus({
          status: 'ok',
          message: `服务正常运行 - ${data.plugin_count} 个插件可用`
        });
      } else {
        setApiStatus({
          status: 'error',
          message: `服务异常 - ${response.status}`
        });
      }
    } catch (err) {
      setApiStatus({
        status: 'error',
        message: '无法连接到服务'
      });
    } finally {
      setHealthCheckLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
    
    // 每30秒检查一次API状态
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {healthCheckLoading ? (
        <span className="text-muted-foreground text-xs sm:text-sm">检查服务状态...</span>
      ) : apiStatus?.status === 'ok' ? (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm hidden sm:inline">{apiStatus.message}</span>
          <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm sm:hidden">服务正常</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
          <span className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{apiStatus?.message || '服务状态未知'}</span>
        </div>
      )}
      
      <Toggle 
        variant="outline" 
        aria-label="切换主题"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-full"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Toggle>
    </div>
  );
}