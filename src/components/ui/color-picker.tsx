"use client";

import { HexColorPicker } from "react-colorful";
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
        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
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
      {isOpen && (
        <div className="absolute top-12 left-0 z-50 p-2 bg-white border rounded shadow">
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
