'use client';

import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, ExternalLink, SortAsc, SortDesc } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { WelcomeCard } from "@/components/welcome-card";
import { Disclaimer } from "@/components/disclaimer";

// 网盘类型选项
const CLOUD_TYPES = [
  { id: 'baidu', name: '百度网盘', icon: 'https://favicon.im/pan.baidu.com' },
  { id: 'aliyun', name: '阿里云盘', icon: 'https://favicon.im/aliyundrive.com' },
  { id: 'quark', name: '夸克网盘', icon: 'https://favicon.im/quark.cn' },
  { id: 'tianyi', name: '天翼云盘', icon: 'https://favicon.im/cloud.189.cn' },
  { id: 'uc', name: 'UC网盘', icon: 'https://favicon.im/uc.cn' },
  { id: 'mobile', name: '移动云盘', icon: 'https://favicon.im/caiyun.139.com' },
  { id: '115', name: '115网盘', icon: 'https://favicon.im/115.com' },
  { id: 'pikpak', name: 'PikPak', icon: 'https://favicon.im/mypikpak.net' },
  { id: 'xunlei', name: '迅雷云盘', icon: 'https://favicon.im/xunlei.com' },
  { id: '123', name: '123网盘', icon: 'https://favicon.im/123pan.com' },
  { id: 'magnet', name: '磁力链接', icon: 'https://favicon.im/bt.com' },
  { id: 'ed2k', name: '电驴链接', icon: 'https://favicon.im/emule-project.net' }
];

// 定义搜索结果类型
export interface SearchResultItem {
  note: string;
  url: string;
  password?: string;
  datetime: string;
}

interface SearchResults {
  total: number;
  merged_by_type: Record<string, SearchResultItem[]>;
}

export default function Home() {
  // 设置页面SEO信息
  const pageMeta = {
    title: "星尘网盘搜索 - 网盘资源聚合搜索平台",
    description: "星尘网盘搜索是一个专业的网盘资源聚合搜索平台，支持百度网盘、阿里云盘、夸克网盘、迅雷云盘等12种主流网盘资源搜索，提供精准的资源筛选和排序功能，帮助用户快速找到所需资源。"
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCloudTypes, setSelectedCloudTypes] = useState<string[]>([...CLOUD_TYPES.map(t => t.id)]); // 默认全选
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [activeCloudType, setActiveCloudType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthCheckLoading, setHealthCheckLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'datetime' | 'name'>('datetime'); // 排序方式
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 排序顺序
  const toastRef = useRef<number | string | null>(null);

  // 页面加载时检查API状态
  useEffect(() => {
    checkApiHealth();
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const kw = urlParams.get('kw');
    if (kw) {
      setSearchTerm(kw);
      performSearch(kw);
    }
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

  // 格式化网盘类型名称
  const formatCloudTypeName = (type: string) => {
    const typeObj = CLOUD_TYPES.find(t => t.id === type);
    return typeObj ? (
      <span className="inline-flex items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={typeObj.icon} 
          alt={`${typeObj.name} favicon`} 
          className="w-4 h-4 inline-block"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {typeObj.name}
      </span>
    ) : type;
  };

  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setError('请输入搜索关键词');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveCloudType(null); // 重置活动的网盘类型
    
    // 如果有正在显示的toast，先清除
    if (toastRef.current) {
      toast.dismiss(toastRef.current);
    }
    
    try {
      // 调用搜索API（通过代理）
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kw: term,
          res: 'merge', // 默认使用merge结果类型
          src: 'all', // 全部来源
          cloud_types: selectedCloudTypes.length === CLOUD_TYPES.length ? undefined : selectedCloudTypes // 如果全选则不传参数
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // 修正数据结构，实际数据在result.data中
        setSearchResults(result.data || result);
        toastRef.current = toast.success("搜索完成", {
          description: `找到 ${result.data?.total || result.total || 0} 条结果`,
        });
      } else if (response.status === 400) {
        setError('参数错误：关键词不能为空');
        toastRef.current = toast.error("搜索失败", {
          description: "参数错误：关键词不能为空",
        });
      } else if (response.status === 429) {
        setError('请求过于频繁，请稍后再试');
        toastRef.current = toast.error("搜索失败", {
          description: "请求过于频繁，请稍后再试",
        });
      } else {
        setError(`搜索失败: ${response.status}`);
        toastRef.current = toast.error("搜索失败", {
          description: `HTTP错误: ${response.status}`,
        });
      }
    } catch (err) {
      setError('搜索出错，请稍后重试');
      toastRef.current = toast.error("搜索失败", {
        description: "网络错误，请检查连接后重试",
      });
      console.error('搜索出错:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCloudTypes]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  // 切换排序方式
  const handleSortChange = (newSortBy: 'datetime' | 'name', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <>
      <Head>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content="网盘搜索, 百度网盘, 阿里云盘, 夸克网盘, 资源搜索, 网盘资源, 磁力链接, 电驴链接" />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://so.dustpix.com" />
        <meta property="og:image" content="https://so.dustpix.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMeta.title} />
        <meta name="twitter:description" content={pageMeta.description} />
        <meta name="twitter:image" content="https://so.dustpix.com/logo.png" />
        <link rel="canonical" href="https://so.dustpix.com" />
      </Head>
      <div className="bg-gradient-to-br from-background to-secondary py-6 sm:py-8 md:py-12 flex flex-col min-h-screen backdrop-blur-sm">
        <div className="flex-grow">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground sr-only">星尘网盘搜索</h1>
            </div>
            
            <SearchForm 
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              loading={loading}
              onSearch={handleSearch}
              selectedCloudTypes={selectedCloudTypes}
              onCloudTypesChange={setSelectedCloudTypes}
              error={error}
              cloudTypes={CLOUD_TYPES}
            />

            {searchResults && (
              <SearchResults
                results={searchResults}
                activeCloudType={activeCloudType}
                onActiveCloudTypeChange={setActiveCloudType}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                formatCloudTypeName={formatCloudTypeName}
              />
            )}
            
            {!searchResults && !loading && (
              <WelcomeCard 
                onCheckHealth={checkApiHealth}
                healthCheckLoading={healthCheckLoading}
              />
            )}
          </div>
        </div>
        <div className="mt-auto">
          <Disclaimer />
        </div>
      </div>
    </>
  );
}