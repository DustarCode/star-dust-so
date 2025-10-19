'use client';

import { HeaderControls } from "@/components/header-controls";

export function Header() {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="py-4 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src="/logo.png"
            alt="星尘网盘搜索 Logo"
            width="40"
            height="40"
          />
          <h1 className="text-xl font-bold">星尘网盘搜索</h1>
        </div>
        <HeaderControls />
      </div>
    </header>
  );
}