import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FormInput,
  Mail,
  Badge as BadgeIcon,
  Scan,
  Monitor,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  link: string;
  status: "Published" | "In Progress" | "Completed" | "Not Started";
  statusColor: "blue" | "yellow" | "green" | "gray";
  actionText: string;
  icon: string;
}

export default function ToolCard({
  title,
  description,
  link,
  status,
  statusColor,
  actionText,
  icon
}: ToolCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "form-input":
        return <FormInput className="h-6 w-6 text-gray-900" />;
      case "mail":
        return <Mail className="h-6 w-6 text-gray-900" />;
      case "badge":
        return <BadgeIcon className="h-6 w-6 text-gray-900" />;
      case "scan":
        return <Scan className="h-6 w-6 text-gray-900" />;
      case "monitor":
        return <Monitor className="h-6 w-6 text-gray-900" />;
      case "calendar":
        return <Calendar className="h-6 w-6 text-gray-900" />;
      default:
        return <FormInput className="h-6 w-6 text-gray-900" />;
    }
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "green":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Link href={link}>
      <Card className={cn(
        "transition-shadow bg-white hover:shadow-md",
        status === "In Progress" && "opacity-50 cursor-not-allowed"
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              {getIcon(icon)}
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(statusColor)} text-xs`}>
              {status}
            </Badge>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              {actionText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
