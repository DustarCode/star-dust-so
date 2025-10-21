'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { SearchResultItem } from '@/app/page';

export interface SearchResultsListProps {
  results: {
    merged_by_type: Record<string, SearchResultItem[]>;
  };
  activeCloudType: string | null;
  sortBy: 'datetime' | 'name';
  sortOrder: 'asc' | 'desc';
  formatCloudTypeName: (type: string) => string | React.JSX.Element;
}

// 排序函数
const sortResults = (results: SearchResultItem[], sortBy: 'datetime' | 'name', sortOrder: 'asc' | 'desc'): SearchResultItem[] => {
  return [...results].sort((a, b) => {
    if (sortBy === 'datetime') {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const nameA = a.note.toLowerCase();
      const nameB = b.note.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    }
  });
};

// 复制文本到剪贴板
const copyToClipboard = (text: string, message: string): void => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(`${message}已复制到剪贴板`);
  }).catch(() => {
    toast.error("复制失败，请手动复制");
  });
};

export const SearchResultsList = memo(({ 
  results, 
  activeCloudType, 
  sortBy,
  sortOrder,
  formatCloudTypeName
}: SearchResultsListProps): React.JSX.Element => {
  if (activeCloudType === null) {
    // 显示所有网盘类型的结果
    return (
      <>
        {Object.keys(results.merged_by_type).map((cloudType) => (
          <div key={cloudType} className="mb-8 last:mb-0">
            <h3 className="text-base sm:text-lg font-medium mb-4 capitalize border-b border-white/20 pb-2 flex flex-wrap items-center gap-2">
              <span className="bg-white/50 dark:bg-black/50 text-primary rounded-full px-3 py-1.5 flex items-center gap-1 backdrop-blur-sm border border-white/30">
                {formatCloudTypeName(cloudType)}
              </span>
              <span className="text-muted-foreground text-sm">
                ({results.merged_by_type[cloudType].length} 个资源)
              </span>
            </h3>
            <div className="space-y-4 sm:space-y-5">
              {sortResults(results.merged_by_type[cloudType], sortBy, sortOrder).map((item: SearchResultItem, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl">
                  <CardHeader className="pb-3">
                    <div className="flex flex-nowrap justify-between items-start gap-2 min-w-0">
                      <CardTitle 
                        className="text-base sm:text-lg font-medium truncate min-w-0 max-w-[70%] block"
                        title={item.note}
                      >
                        {item.note}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground bg-white/50 dark:bg-black/50 px-2 py-1 rounded whitespace-nowrap flex-shrink-0 backdrop-blur-sm border border-white/30">
                        {new Date(item.datetime).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {item.password && (
                          <span className="text-sm text-foreground">
                            提取码: <span className="font-mono bg-white/50 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/30">{item.password}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(item.url, '链接')}
                          className="flex items-center gap-1.5 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="hidden xs:inline">复制链接</span>
                          <span className="xs:hidden">复制</span>
                        </Button>
                        <Button asChild size="sm" className="gap-1.5 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            访问链接
                          </a>
                        </Button>
                        
                        {item.password && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(item.password || '', '提取码')}
                            className="flex items-center gap-1.5 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                          >
                            <Copy className="h-4 w-4" />
                            <span className="hidden xs:inline">复制提取码</span>
                            <span className="xs:hidden">提取码</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  } else {
    // 只显示选中的网盘类型结果
    return (
      <div className="mb-8">
        <h3 className="text-base sm:text-lg font-medium mb-4 capitalize border-b border-white/20 pb-2 flex flex-wrap items-center gap-2">
          <span className="bg-white/50 dark:bg-black/50 text-primary rounded-full px-3 py-1.5 flex items-center gap-1 backdrop-blur-sm border border-white/30">
            {formatCloudTypeName(activeCloudType)}
          </span>
          <span className="text-muted-foreground text-sm">
            ({results.merged_by_type[activeCloudType].length} 个资源)
          </span>
        </h3>
        <div className="space-y-4 sm:space-y-5">
          {sortResults(results.merged_by_type[activeCloudType], sortBy, sortOrder).map((item: SearchResultItem, index: number) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex flex-nowrap justify-between items-start gap-2 min-w-0">
                  <CardTitle 
                    className="text-base sm:text-lg font-medium truncate min-w-0 max-w-[70%] block"
                    title={item.note}
                  >
                    {item.note}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground bg-white/50 dark:bg-black/50 px-2 py-1 rounded whitespace-nowrap flex-shrink-0 backdrop-blur-sm border border-white/30">
                    {new Date(item.datetime).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {item.password && (
                      <span className="text-sm text-foreground">
                        提取码: <span className="font-mono bg-white/50 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/30">{item.password}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item.url, '链接')}
                      className="flex items-center gap-1.5 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden xs:inline">复制链接</span>
                      <span className="xs:hidden">复制</span>
                    </Button>
                    <Button asChild size="sm" className="gap-1.5 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        访问链接
                      </a>
                    </Button>
                    
                    {item.password && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(item.password || '', '提取码')}
                        className="flex items-center gap-1.5 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="hidden xs:inline">复制提取码</span>
                        <span className="xs:hidden">提取码</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
});

SearchResultsList.displayName = 'SearchResultsList';
