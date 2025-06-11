import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Mail,
  Award,
  Scan,
  Monitor,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  link: string;
  status: "New" | "Popular" | "Premium" | "";
  icon: string;
  isActive: boolean;
}

export default function ToolCard({
  title,
  description,
  link,
  status,
  icon,
  isActive
}: ToolCardProps) {
  const getIcon = (iconName: string) => {
    const className = "h-7 w-7 text-gray-900";
    switch (iconName) {
      case "form-input":
        return <FileText className={className} />;
      case "mail":
        return <Mail className={className} />;
      case "badge":
        return <Award className={className} />;
      case "scan":
        return <Scan className={className} />;
      case "monitor":
        return <Monitor className={className} />;
      case "calendar":
        return <Calendar className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Popular":
        return "bg-blue-100 text-blue-800";
      case "Premium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
  };

  return (
    <Link href={link}>
      <div className={`border rounded-xl p-4 bg-white min-h-[200px] flex flex-col justify-between ${isActive ? 'hover:shadow-lg transition-all duration-200' : 'opacity-60 cursor-not-allowed'}`}>
        <div className="flex items-start justify-between">
          <div className="p-1 bg-gray-100 rounded-md">
            {getIcon(icon)}
          </div>
          {status && (
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                getStatusStyle(status)
              )}
            >
              {status}
            </span>
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <Button className="mt-4 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-200 hover:bg-black hover:text-white hover:border-none" variant="outline" disabled={!isActive}>
          Open Tool
        </Button>
      </div>
    </Link>
  );
}
