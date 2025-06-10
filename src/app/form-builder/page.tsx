"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FormCard from "@/components/form-builder/form-card";
import FormPreview from "@/components/form-builder/form-preview";
import formData from "@/data/organizer/form.json";

export default function Dashboard() {
  // Ensure formData is an array
  const forms = Array.isArray(formData) ? formData : [formData];
  const [open, setOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewForm = () => {
    window.location.href = '/form-builder/builder';
  };

  // forms is now always an array (see above)
  const filteredForms = useMemo(() => {
    if (!searchQuery) return forms;
    return forms.filter((form: any) =>
      form.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, forms]);

  return (
    <DashboardLayout title="Forms">
      <div className="max-w-6xl p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl text-gray-900 font-bold tracking-tight mb-1">Form Templates</h1>
            <p className="text-gray-500">Manage and create your form templates with ease.</p>
          </div>
          <Button onClick={handleNewForm} size="lg" className="bg-black hover:bg-black/90 text-white cursor-pointer">
            <Plus className="mr-1 h-5 w-5" /> Create New Form
          </Button>
        </div>
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-700" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 text-gray-700 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {filteredForms.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[400px] bg-card text-gray-500">
            <FileText className="h-20 w-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">No Forms Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery
                ? `Your search for "${searchQuery}" did not match any forms. Try a different term or clear the search.`
                : "You haven't created any forms yet. Let's get started!"}
            </p>
            <Button onClick={handleNewForm} size="lg">
              <Plus className="mr-2 h-5 w-5" /> Create Your First Form
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredForms.map((form: any) => (
              <FormCard
                key={form.id}
                form={form}
                onPreview={() => {
                  setSelectedForm(form);
                  setOpen(true);
                }}
              />
            ))}
          </div>
        )}
        {/* Modal for form preview and entry */}
        {selectedForm && (
          <FormPreview
            isOpen={open}
            onClose={() => setOpen(false)}
            form={selectedForm}
            fields={selectedForm.fields || []}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

