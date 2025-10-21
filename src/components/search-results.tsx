'use client';

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SortAsc, SortDesc } from "lucide-react";
import type { SearchResultItem } from '@/app/page';
import { SearchResultsList } from '@/components/search-results-list';

export interface SearchResultsProps {
  results: {
    total: number;
    merged_by_type: Record<string, SearchResultItem[]>;
  };
  activeCloudType: string | null;
  onActiveCloudTypeChange: (type: string | null) => void;
  sortBy: 'datetime' | 'name';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'datetime' | 'name', sortOrder: 'asc' | 'desc') => void;
  formatCloudTypeName: (type: string) => string | React.JSX.Element;
}

export const SearchResults = memo(({ 
  results, 
  activeCloudType, 
  onActiveCloudTypeChange,
  sortBy,
  sortOrder,
  onSortChange,
  formatCloudTypeName
}: SearchResultsProps): React.JSX.Element => {
  // 切换排序方式
  const toggleSortBy = (newSortBy: 'datetime' | 'name'): void => {
    if (sortBy === newSortBy) {
      // 如果点击的是当前排序方式，则切换排序顺序
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果点击的是新的排序方式，则设置为该方式并默认降序
      onSortChange(newSortBy, 'desc');
    }
  };

  return (
    <Card className="shadow-xl backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-xl sm:text-2xl">搜索结果</CardTitle>
          <p className="text-foreground">
            共找到 <span className="font-bold text-primary">{results.total || 0}</span> 条结果
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {results.merged_by_type && Object.keys(results.merged_by_type).length > 0 ? (
          <>
            {/* 网盘类型标签导航 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                onClick={() => onActiveCloudTypeChange(null)}
                variant={activeCloudType === null ? "default" : "outline"}
                className="rounded-full px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 dark:from-blue-600 dark:to-cyan-500 dark:hover:from-blue-700 dark:hover:to-cyan-600 backdrop-blur-md border border-white/30 text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              >
                全部 ({Object.keys(results.merged_by_type).length})
              </Button>
              {Object.keys(results.merged_by_type).map((cloudType) => (
                <Button
                  key={cloudType}
                  onClick={() => onActiveCloudTypeChange(cloudType)}
                  variant={activeCloudType === cloudType ? "default" : "outline"}
                  className="rounded-full flex items-center gap-1 px-3 py-2 h-auto bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 dark:from-blue-600 dark:to-cyan-500 dark:hover:from-blue-700 dark:hover:to-cyan-600 backdrop-blur-md border border-white/30 text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                >
                  {formatCloudTypeName(cloudType)}
                  <span className="bg-white/50 dark:bg-black/50 text-foreground rounded-full px-2 py-0.5 text-xs font-medium border border-white/30">
                    {results.merged_by_type[cloudType].length}
                  </span>
                </Button>
              ))}
            </div>

            {/* 排序控件 */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <Label className="text-foreground font-medium text-sm">排序:</Label>
              </div>
              <Button
                variant={sortBy === 'datetime' ? "default" : "outline"}
                onClick={() => toggleSortBy('datetime')}
                className="flex items-center gap-1 rounded-full px-3 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white"
              >
                <span>按时间</span>
                {sortBy === 'datetime' && (
                  sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant={sortBy === 'name' ? "default" : "outline"}
                onClick={() => toggleSortBy('name')}
                className="flex items-center gap-1 rounded-full px-3 bg-blue-500/80 hover:bg-blue-600/90 dark:bg-blue-600/80 dark:hover:bg-blue-700/90 backdrop-blur-md border border-white/30 text-white"
              >
                <span>按名称</span>
                {sortBy === 'name' && (
                  sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>

            <SearchResultsList 
              results={results}
              activeCloudType={activeCloudType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              formatCloudTypeName={formatCloudTypeName}
            />
          </>
        ) : (
          <div className="text-center py-12 sm:py-16 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/20">
            <div className="text-4xl sm:text-5xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">未找到相关资源</h3>
            <p className="text-muted-foreground">尝试使用其他关键词进行搜索</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

SearchResults.displayName = 'SearchResults';