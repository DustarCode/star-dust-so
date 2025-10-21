'use client';

import { useState, useEffect } from 'react';
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function HeaderControls() {
  const [healthCheckLoading, setHealthCheckLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 检查API健康状态
  const checkApiHealth = async () => {
    setHealthCheckLoading(true);
    try {
      const response = await fetch('/api/search');
      if (response.ok) {
        await response.json();
      }
    } catch (err) {
      console.error('API健康检查失败:', err);
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
      ) : (
        <div className="flex items-center gap-1 bg-blue-500/80 dark:bg-blue-600/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/30 text-white">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          <span className="text-xs sm:text-sm">服务正常</span>
        </div>
      )}
      
      <Toggle 
        variant="outline" 
        aria-label="切换主题"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-full transition-all duration-300 hover:shadow-md bg-blue-500/80 dark:bg-blue-600/80 backdrop-blur-md border border-white/30 text-white"
        disabled={!mounted}
      >
        {mounted && theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : mounted && theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Toggle>
    </div>
  );
}