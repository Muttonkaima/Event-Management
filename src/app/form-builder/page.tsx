"use client";

import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Dashboard() {

  const handleNewForm = () => {
    window.location.href = '/form-builder/builder';
  };
  return (
    <DashboardLayout title="Forms">

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first registration form</p>
            <Button onClick={handleNewForm} className="bg-black cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Form
            </Button>
          </div>
        </div>
      </DashboardLayout>
  );
}
                   