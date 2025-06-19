import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardList } from "lucide-react";

import { Edit3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormCardProps {
  form: any;
  onPreview: () => void;
  onDelete?: (id: string) => void;
  onUse?: (id: string) => void;
}

export default function FormCard({ form, onPreview, onDelete, onUse }: FormCardProps) {
  const router = useRouter();
  // The form.id is now always available for use in keys, navigation, etc.
  return (
    <div
      className="relative group rounded-2xl overflow-hidden min-h-[210px] shadow-xl border border-gray-100 border-b-5 border-b-black bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={onPreview}
    >
      
      {/* Floating Action Buttons (Edit/Delete) on hover */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40">
        <button
          className="h-8 w-8 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-blue-50 text-blue-600 border border-blue-100"
          title="Edit"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation();
            router.push(`/form-builder/builder?edit=${form.id}`);
          }}
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          className="h-8 w-8 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-red-50 text-red-600 border border-red-100"
          title="Delete"
          tabIndex={-1}
          onClick={e => {
            e.stopPropagation();
            if (onDelete) {
              onDelete(form.id);
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {/* Dynamic Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/0 via-violet-100/20 to-blue-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      {/* Card Content */}
      <div className="relative flex-1 flex flex-col px-6 pt-8 pb-6 gap-2 z-20">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-gray-900 truncate flex-1 drop-shadow-sm">
            {form.title}
          </h3>
          
        </div>
        <span className="text-xs text-gray-600 line-clamp-2 mb-2 font-medium">
          {form.description}
        </span>
        <div className="flex-1" />
        {/* Bottom Info Bar */}
        <div className="flex items-end justify-between mt-2">
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full shadow border border-blue-200">
            {form.fields.length} fields
          </span>
          <Button
            size="sm"
            className="bg-white text-gray-900 hover:bg-black hover:text-white cursor-pointer shadow px-4 py-1"
            onClick={(e) => {
              e.stopPropagation();
              if (onUse) {
                onUse(form.id);
              }
            }}
          >
            <FileText className="mr-2 h-4 w-4" /> Use Form
          </Button>
        </div>
      </div>
    </div>
  );
}


