"use client";

import React from "react";
import registrationData from "@/data/user/registration.json";
import { Card } from "@/components/ui/card";
import {
  BadgeCheck,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/components/user/event-dashboard/DashboardLayout";
import eventData from "@/data/user/detailEvents.json";
import formStructure from "@/data/organizer/form.json";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type definitions
interface RegistrationFormData {
  "First Name": string;
  "Last Name": string;
  Age: number;
  School: string;
  Address: string;
  Photo: string;
  "Date of Birth": string;
  "Phone Number": string;
  "I agree to terms & conditions": boolean;
  [key: string]: any; // allow extra
}

interface FormField {
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: string[];
}

export default function RegistrationDetails() {
  if (!registrationData || !registrationData.formData) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <FileText className="mx-auto w-14 h-14 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">No Registration Found</h2>
          <p className="text-gray-500">You have not submitted any registration yet.</p>
        </div>
      </div>
    );
  }


  const { formTitle, submittedAt, formData } = registrationData;
  const [showEdit, setShowEdit] = React.useState(false);
  const [currentData, setCurrentData] = React.useState<RegistrationFormData>(formData);
  const [submitting, setSubmitting] = React.useState(false);

  const updateDeadline = eventData?.registration?.updateDeadline;
  const deadlineDate = updateDeadline ? new Date(updateDeadline) : null;
  const now = new Date();
  const canEdit = deadlineDate ? now < deadlineDate : false;

  function handleEditSave(newData: any) {
    setCurrentData(newData);
    setShowEdit(false);
  }

  return (
    <DashboardLayout title="Registration Details">
      <section className="w-full max-w-5xl mx-auto p-3">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {currentData["Photo"] ? (
              <img
                src={currentData["Photo"]}
                alt="User Photo"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}

            <div className="text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                <BadgeCheck className="w-6 h-6 text-green-500" /> {formTitle}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mt-1">
                <Calendar className="w-4 h-4" />
                {submittedAt ? new Date(submittedAt).toLocaleString() : ""}
              </div>
              <div className="text-xs text-green-500 mt-1 ">Registered</div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
              <DialogTrigger asChild>
                <button
                  className="w-full md:w-auto px-5 py-2 rounded-md font-semibold text-white text-sm bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  disabled={!canEdit}
                >
                  Edit Registration
                </button>
              </DialogTrigger>
              <EditRegistrationModal
                open={showEdit}
                onOpenChange={setShowEdit}
                formTitle={formTitle}
                formData={currentData}
                canEdit={canEdit}
                onSave={handleEditSave}
                submitting={submitting}
                setSubmitting={setSubmitting}
              />
            </Dialog>
            <p className="text-xs text-gray-500 mt-1">
              Update or cancellation before{" "}
              {deadlineDate ? deadlineDate.toLocaleString() : "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-6">
          {(formStructure[0]?.fields as FormField[] || []).map((field, index) => {
            const value = (currentData as Record<string, any>)[field.label.trim()];
            if (field.type === "file") return null; // Avatar handled above
            return (
              <Card
                key={index}
                className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition flex flex-col gap-1"
              >
                <div className="text-sm text-gray-500 font-medium mb-1">{field.label}</div>
                <div className="text-base font-medium text-gray-900 break-words">
                  {field.type === "checkbox"
                    ? value ? "Yes" : "No"
                    : field.type === "dropdown"
                    ? value
                    : field.type === "textarea"
                    ? <span className="whitespace-pre-line">{value}</span>
                    : value}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}

function EditRegistrationModal({ open, onOpenChange, formTitle, formData, canEdit, onSave, submitting, setSubmitting }: any) {
  const [fields, setFields] = React.useState<any>(formData);

  React.useEffect(() => {
    setFields(formData);
  }, [formData, open]);

  function handleFieldChange(label: string, value: any) {
    setFields((prev: any) => ({ ...prev, [label]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSave(fields);
    }, 600);
  }

  return (
    <DialogContent className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-0 overflow-auto">
    <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Sticky header for mobile UX */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 pt-4 pb-2 flex items-center justify-between">
        <DialogTitle className="text-lg font-bold text-gray-900">Edit Registration</DialogTitle>
        <DialogClose asChild>
          <button
            type="button"
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </DialogClose>
      </div>
  
      <DialogDescription className="px-6 text-sm text-gray-500 mb-2 mt-1">You can update your details before the deadline.</DialogDescription>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 px-6 pt-2 pb-1">
        {formStructure[0]?.fields.map((field: any) => {
          if (field.type === "file") return null; // Avatar upload not supported
          const value = fields[field.label.trim()];
  
          if (field.type === "checkbox") {
            return (
              <div key={field.label} className="col-span-2 flex items-center gap-2 py-3 last:border-none">
                <input
                  id={field.label}
                  type="checkbox"
                  checked={!!value}
                  onChange={e => handleFieldChange(field.label, e.target.checked)}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                  disabled={submitting || !canEdit}
                />
                <label htmlFor={field.label} className="text-sm text-gray-700 font-medium">
                  {field.label}
                </label>
              </div>
            );
          }
  
          if (field.type === "dropdown") {
            return (
              <div key={field.label} className="col-span-2 md:col-span-1 flex flex-col gap-1 py-3 last:border-none">
                <label htmlFor={field.label} className="text-xs text-gray-500 font-medium mb-1">
                  {field.label}
                </label>
                <select
                  id={field.label}
                  value={value || ""}
                  onChange={e => handleFieldChange(field.label, e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-base text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition bg-white"
                  disabled={submitting || !canEdit}
                  required={field.required}
                >
                  <option value="" disabled>{field.placeholder}</option>
                  {field.options && field.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }
  
          if (field.type === "textarea") {
            return (
              <div key={field.label} className="col-span-2 flex flex-col gap-1 py-3 last:border-none">
                <label htmlFor={field.label} className="text-xs text-gray-500 font-medium mb-1">
                  {field.label}
                </label>
                <textarea
                  id={field.label}
                  value={value || ""}
                  onChange={e => handleFieldChange(field.label, e.target.value)}
                  placeholder={field.placeholder}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-base text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition bg-white min-h-[64px] resize-y"
                  disabled={submitting || !canEdit}
                  required={field.required}
                />
              </div>
            );
          }
  
          // Default input types
          let inputType = "text";
          if (field.type === "number") inputType = "number";
          if (field.type === "date") inputType = "date";
          if (field.type === "phone") inputType = "tel";
  
          return (
            <div key={field.label} className="col-span-2 md:col-span-1 flex flex-col gap-1 py-3 last:border-none">
              <label htmlFor={field.label} className="text-xs text-gray-500 font-medium mb-1">
                {field.label}
              </label>
              <input
                id={field.label}
                type={inputType}
                value={inputType === "date" && value ? String(value).slice(0, 10) : value || ""}
                onChange={e => handleFieldChange(field.label, inputType === "number" ? Number(e.target.value) : e.target.value)}
                placeholder={field.placeholder}
                className="rounded-lg border border-gray-300 px-4 py-2 text-base text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition bg-white placeholder-gray-400"
                disabled={submitting || !canEdit}
                required={field.required}
              />
            </div>
          );
        })}
      </div>
  
      <DialogFooter className="mt-4 px-6 pb-4 pt-2 bg-white border-t border-gray-100 flex flex-row gap-2">
        <DialogClose asChild>
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition flex-1 cursor-pointer"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
        </DialogClose>
        <button
          type="submit"
          className="px-5 py-2 rounded-md text-white text-sm bg-black transition disabled:opacity-60 disabled:cursor-not-allowed flex-1 cursor-pointer"
          disabled={submitting || !canEdit}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </DialogFooter>
    </form>
  </DialogContent>
  
  );
}
