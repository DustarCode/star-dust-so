'use client';

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface CloudType {
  id: string;
  name: string;
  icon: string;
}

export interface CloudTypeSelectorProps {
  cloudTypes: CloudType[];
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

export const CloudTypeSelector = memo(({ 
  cloudTypes, 
  selectedTypes, 
  onSelectionChange 
}: CloudTypeSelectorProps): React.JSX.Element => {
  // 全选/取消全选网盘类型
  const toggleAllCloudTypes = (): void => {
    if (selectedTypes.length === cloudTypes.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(cloudTypes.map(t => t.id));
    }
  };

  // 切换网盘类型选择
  const toggleCloudType = (type: string): void => {
    if (selectedTypes.includes(type)) {
      onSelectionChange(selectedTypes.filter(t => t !== type));
    } else {
      onSelectionChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Label className="text-foreground font-medium">网盘类型:</Label>
        <Button
          type="button"
          variant="ghost"
          onClick={toggleAllCloudTypes}
          className="text-sm h-auto p-1 text-primary hover:text-primary/90"
        >
          {selectedTypes.length === cloudTypes.length ? '取消全选' : '全选'}
        </Button>
        <span className="text-sm text-muted-foreground">
          (已选择 {selectedTypes.length}/{cloudTypes.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {cloudTypes.map((type) => (
          <Button
            key={type.id}
            type="button"
            variant={selectedTypes.includes(type.id) ? "default" : "outline"}
            onClick={() => toggleCloudType(type.id)}
            className="px-4 py-2 text-sm rounded-full transition-all duration-300 flex items-center gap-2 h-auto shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary focus:shadow-[0_0_0_3px_rgba(96,165,250,0.3)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={type.icon} 
              alt={`${type.name} favicon`} 
              className="w-5 h-5"
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
  );
});

CloudTypeSelector.displayName = 'CloudTypeSelector';