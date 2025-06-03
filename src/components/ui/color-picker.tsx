"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative flex items-center space-x-3 ${className}`}>
      <div 
        className="w-8 h-8 border border-gray-300 rounded flex-shrink-0 cursor-pointer"
        style={{ backgroundColor: value }}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-sm"
        onClick={() => setIsOpen(true)}
      />
      <div className="absolute left-0 top-10 z-50">
        <input
          type="color"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // Keep it open to allow picking different shades
          }}
          className={`w-0 h-0 opacity-0 ${isOpen ? 'block' : 'hidden'}`}
          id="color-picker"
        />
      </div>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
