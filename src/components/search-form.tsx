'use client';

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CloudTypeSelector } from "@/components/cloud-type-selector";
import type { CloudType } from '@/components/cloud-type-selector';

export interface SearchFormProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  loading: boolean;
  onSearch: (e: React.FormEvent) => void;
  selectedCloudTypes: string[];
  onCloudTypesChange: (types: string[]) => void;
  error: string | null;
  cloudTypes: CloudType[];
}

export const SearchForm = memo(({
  searchTerm,
  onSearchTermChange,
  loading,
  onSearch,
  selectedCloudTypes,
  onCloudTypesChange,
  error,
  cloudTypes
}: SearchFormProps): React.JSX.Element => {
  return (
    <Card className="mb-6 sm:mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl sm:text-2xl">搜索资源</CardTitle>
        <CardDescription>请输入关键词搜索各类网盘资源</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSearch}>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="请输入搜索关键词，如：电影、电视剧、软件..."
              className="flex-1 text-base sm:text-lg h-12 sm:h-14 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-[0_0_0_3px_rgba(96,165,250,0.3)]"
            />
            <Button
              type="submit"
              disabled={loading}
              className="text-base sm:text-lg font-medium h-12 sm:h-14 px-6 sm:px-8 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary focus:shadow-[0_0_0_3px_rgba(96,165,250,0.3)]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  搜索中...
                </span>
              ) : '搜索'}
            </Button>
          </div>
          
          <CloudTypeSelector 
            cloudTypes={cloudTypes}
            selectedTypes={selectedCloudTypes}
            onSelectionChange={onCloudTypesChange}
          />
          
          {error && (
            <div className="mt-3 p-3 bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl border border-red-500/30 backdrop-blur-sm">
              {error}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          支持搜索多种网盘资源，包括：百度网盘、阿里云盘、夸克网盘、迅雷云盘等
        </p>
      </CardFooter>
    </Card>
  );
});

SearchForm.displayName = 'SearchForm';