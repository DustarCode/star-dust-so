'use client';

import { HeaderControls } from "@/components/header-controls";
import Image from "next/image";

export function Header() {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="py-4 border-b border-white/20 bg-white/30 dark:bg-black/30 backdrop-blur-xl shadow-sm rounded-b-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-4 hover:opacity-80 transition-all duration-300 cursor-pointer group"
          onClick={handleLogoClick}
        >
          <div className="relative">
            <Image
              src="/logo.png"
              alt="星尘网盘搜索 Logo"
              width={40}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">星尘网盘搜索</h1>
        </div>
        <HeaderControls />
      </div>
    </header>
  );
}