'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Moon, Sun, Copy, ExternalLink, Filter, SortAsc, SortDesc } from "lucide-react";

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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCloudTypes, setSelectedCloudTypes] = useState<string[]>([...CLOUD_TYPES.map(t => t.id)]); // 默认全选
  const [searchResults, setSearchResults] = useState<any>(null);
  const [activeCloudType, setActiveCloudType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{status: string, message?: string} | null>(null);
  const [healthCheckLoading, setHealthCheckLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'datetime' | 'name'>('datetime'); // 排序方式
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 排序顺序
  const { theme, setTheme } = useTheme();
  const toastRef = useRef<number | string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // 页面加载时检查API状态
  useEffect(() => {
    setIsClient(true);
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

  // 排序函数
  const sortResults = (results: any[]) => {
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

  const performSearch = async (term: string) => {
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
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  // 切换网盘类型选择
  const toggleCloudType = (type: string) => {
    if (selectedCloudTypes.includes(type)) {
      setSelectedCloudTypes(selectedCloudTypes.filter(t => t !== type));
    } else {
      setSelectedCloudTypes([...selectedCloudTypes, type]);
    }
  };

  // 全选/取消全选网盘类型
  const toggleAllCloudTypes = () => {
    if (selectedCloudTypes.length === CLOUD_TYPES.length) {
      setSelectedCloudTypes([]);
    } else {
      setSelectedCloudTypes(CLOUD_TYPES.map(t => t.id));
    }
  };

  // 格式化网盘类型名称
  const formatCloudTypeName = (type: string) => {
    const typeObj = CLOUD_TYPES.find(t => t.id === type);
    return typeObj ? (
      <span className="inline-flex items-center gap-1">
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

  // 切换排序方式
  const toggleSortBy = (newSortBy: 'datetime' | 'name') => {
    if (sortBy === newSortBy) {
      // 如果点击的是当前排序方式，则切换排序顺序
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果点击的是新的排序方式，则设置为该方式并默认降序
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // 复制文本到剪贴板
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${message}已复制到剪贴板`);
    }).catch(() => {
      toast.error("复制失败，请手动复制");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary py-6 sm:py-8 md:py-12 flex flex-col">
      <div className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground sr-only">星尘网盘搜索</h1>
            
            {/* 这里移除了原来的API状态指示器和主题切换 */}
          </div>
          
          <Card className="mb-6 sm:mb-8 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl">搜索资源</CardTitle>
              <CardDescription>请输入关键词搜索各类网盘资源</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch}>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="请输入搜索关键词，如：电影、电视剧、软件..."
                    className="flex-1 text-base sm:text-lg h-12 sm:h-14 px-4"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="text-base sm:text-lg font-medium h-12 sm:h-14 px-6 sm:px-8"
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
                
                {/* 网盘类型选择 */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Label className="text-foreground font-medium">网盘类型:</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleAllCloudTypes}
                      className="text-sm h-auto p-1 text-primary hover:text-primary/90"
                    >
                      {selectedCloudTypes.length === CLOUD_TYPES.length ? '取消全选' : '全选'}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      (已选择 {selectedCloudTypes.length}/{CLOUD_TYPES.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CLOUD_TYPES.map((type) => (
                      <Button
                        key={type.id}
                        type="button"
                        variant={selectedCloudTypes.includes(type.id) ? "default" : "outline"}
                        onClick={() => toggleCloudType(type.id)}
                        className="px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1 h-auto"
                      >
                        <img 
                          src={type.icon} 
                          alt={`${type.name} favicon`} 
                          className="w-4 h-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span>{type.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {error && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
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

          {searchResults && (
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-xl sm:text-2xl">搜索结果</CardTitle>
                  <p className="text-foreground">
                    共找到 <span className="font-bold text-primary">{searchResults.total || 0}</span> 条结果
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {searchResults.merged_by_type && Object.keys(searchResults.merged_by_type).length > 0 ? (
                  <>
                    {/* 网盘类型标签导航 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Button
                        onClick={() => setActiveCloudType(null)}
                        variant={activeCloudType === null ? "default" : "outline"}
                        className="rounded-full px-4 py-2 h-auto"
                      >
                        全部 ({Object.keys(searchResults.merged_by_type).length})
                      </Button>
                      {Object.keys(searchResults.merged_by_type).map((cloudType) => (
                        <Button
                          key={cloudType}
                          onClick={() => setActiveCloudType(cloudType)}
                          variant={activeCloudType === cloudType ? "default" : "outline"}
                          className="rounded-full flex items-center gap-1 px-3 py-2 h-auto"
                        >
                          {formatCloudTypeName(cloudType)}
                          <span className="bg-muted text-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                            {searchResults.merged_by_type[cloudType].length}
                          </span>
                        </Button>
                      ))}
                    </div>

                    {/* 排序控件 */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-foreground font-medium text-sm">排序:</Label>
                      </div>
                      <Button
                        variant={sortBy === 'datetime' ? "default" : "outline"}
                        onClick={() => toggleSortBy('datetime')}
                        className="flex items-center gap-1 rounded-full px-3"
                      >
                        <span>按时间</span>
                        {sortBy === 'datetime' && (
                          sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant={sortBy === 'name' ? "default" : "outline"}
                        onClick={() => toggleSortBy('name')}
                        className="flex items-center gap-1 rounded-full px-3"
                      >
                        <span>按名称</span>
                        {sortBy === 'name' && (
                          sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* 结果展示 */}
                    {activeCloudType === null ? (
                      // 显示所有网盘类型的结果
                      Object.keys(searchResults.merged_by_type).map((cloudType) => (
                        <div key={cloudType} className="mb-8 last:mb-0">
                          <h3 className="text-base sm:text-lg font-medium mb-4 capitalize border-b-2 border-border pb-2 flex flex-wrap items-center gap-2">
                            <span className="bg-primary/10 text-primary rounded-full px-3 py-1.5 flex items-center gap-1">
                              {formatCloudTypeName(cloudType)}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              ({searchResults.merged_by_type[cloudType].length} 个资源)
                            </span>
                          </h3>
                          <div className="space-y-4 sm:space-y-5">
                            {sortResults(searchResults.merged_by_type[cloudType]).map((item: any, index: number) => (
                              <Card key={index} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
                                <CardHeader className="pb-3">
                                  <div className="flex flex-wrap justify-between items-start gap-2">
                                    <CardTitle 
                                      className="text-base sm:text-lg font-medium break-words line-clamp-2"
                                      title={item.note}
                                    >
                                      {item.note}
                                    </CardTitle>
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded whitespace-nowrap">
                                      {new Date(item.datetime).toLocaleDateString('zh-CN')}
                                    </span>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap justify-between items-center gap-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                      {item.password && (
                                        <span className="text-sm text-foreground">
                                          提取码: <span className="font-mono bg-muted px-2 py-1 rounded">{item.password}</span>
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(item.url, '链接')}
                                        className="flex items-center gap-1.5"
                                      >
                                        <Copy className="h-4 w-4" />
                                        <span className="hidden xs:inline">复制链接</span>
                                        <span className="xs:hidden">复制</span>
                                      </Button>
                                      <Button asChild size="sm" className="gap-1.5">
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
                                          onClick={() => copyToClipboard(item.password, '提取码')}
                                          className="flex items-center gap-1.5"
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
                      ))
                    ) : (
                      // 只显示选中的网盘类型结果
                      <div className="mb-8">
                        <h3 className="text-base sm:text-lg font-medium mb-4 capitalize border-b-2 border-border pb-2 flex flex-wrap items-center gap-2">
                          <span className="bg-primary/10 text-primary rounded-full px-3 py-1.5 flex items-center gap-1">
                            {formatCloudTypeName(activeCloudType)}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            ({searchResults.merged_by_type[activeCloudType].length} 个资源)
                          </span>
                        </h3>
                        <div className="space-y-4 sm:space-y-5">
                          {sortResults(searchResults.merged_by_type[activeCloudType]).map((item: any, index: number) => (
                            <Card key={index} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
                              <CardHeader className="pb-3">
                                <div className="flex flex-wrap justify-between items-start gap-2">
                                  <CardTitle 
                                    className="text-base sm:text-lg font-medium break-words line-clamp-2"
                                    title={item.note}
                                  >
                                    {item.note}
                                  </CardTitle>
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded whitespace-nowrap">
                                    {new Date(item.datetime).toLocaleDateString('zh-CN')}
                                  </span>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap justify-between items-center gap-3">
                                  <div className="flex flex-wrap items-center gap-3">
                                    {item.password && (
                                      <span className="text-sm text-foreground">
                                        提取码: <span className="font-mono bg-muted px-2 py-1 rounded">{item.password}</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(item.url, '链接')}
                                      className="flex items-center gap-1.5"
                                    >
                                      <Copy className="h-4 w-4" />
                                      <span className="hidden xs:inline">复制链接</span>
                                      <span className="xs:hidden">复制</span>
                                    </Button>
                                    <Button asChild size="sm" className="gap-1.5">
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
                                        onClick={() => copyToClipboard(item.password, '提取码')}
                                        className="flex items-center gap-1.5"
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
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <div className="text-4xl sm:text-5xl mb-4">🔍</div>
                    <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">未找到相关资源</h3>
                    <p className="text-muted-foreground">尝试使用其他关键词进行搜索</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {!searchResults && !loading && (
            <Card className="text-center p-8 sm:p-12 shadow-lg">
              <div className="text-4xl sm:text-6xl mb-4">✨</div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl sm:text-2xl mb-3">欢迎使用星尘网盘搜索</CardTitle>
                <CardDescription className="max-w-md mx-auto text-sm sm:text-base">
                  输入关键词搜索各类网盘资源，支持百度网盘、阿里云盘、夸克网盘等多种资源
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-8">
                <Button
                  onClick={checkApiHealth}
                  disabled={healthCheckLoading}
                  variant="outline"
                >
                  {healthCheckLoading ? '检查中...' : '检查服务状态'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* 免责声明 */}
      <footer className="py-6 bg-muted border-t border-border mt-auto">
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
      </footer>
    </div>
  );
}