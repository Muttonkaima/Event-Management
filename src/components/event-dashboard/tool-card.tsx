import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  FileText,
  Mail,
  Award,
  Scan,
  Monitor,
  Calendar,
  ArrowRight,
  Lock,
  Sparkles,
  Zap,
  Star,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ToolStatus = "New" | "Popular" | "Premium" | "Beta" | "" | "Coming Soon";

export interface ToolCardProps {
  title: string;
  description: string;
  link: string;
  status?: ToolStatus;
  icon: string;
  isActive: boolean;
  isExternal?: boolean;
}

const iconMap = {
  'form-input': FileText,
  'mail': Mail,
  'badge': Award,
  'scan': Scan,
  'monitor': Monitor,
  'calendar': Calendar,
} as const;

type IconName = keyof typeof iconMap;

export default function ToolCard({
  title,
  description,
  link,
  status = "",
  icon,
  isActive,
  isExternal = false
}: ToolCardProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as IconName] || FileText;
    
    return (
      <div className={cn(
        "p-2.5 rounded-lg flex items-center justify-center bg-gray-100 text-gray-900"
      )}>
        <IconComponent className="h-6 w-6" />
      </div>
    );
  };

  const getStatusConfig = (status: ToolStatus) => {
    switch (status) {
      case "New":
        return {
          text: "New",
          className: "bg-green-100 text-green-800 hover:bg-green-100",
          icon: <Sparkles className="h-3 w-3" />
        };
      case "Popular":
        return {
          text: "Popular",
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
          icon: <Zap className="h-3 w-3" />
        };
      case "Premium":
        return {
          text: "Premium",
          className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
          icon: <Star className="h-3 w-3" />
        };
      case "Beta":
        return {
          text: "Beta",
          className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
          icon: <Zap className="h-3 w-3" />
        };
      case "Coming Soon":
        return {
          text: "Coming Soon",
          className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
          icon: <Lock className="h-3 w-3" />
        };
      default:
        return null;
    }
  };

  const statusConfig = status ? getStatusConfig(status) : null;
  const content = (
    <Card 
      className={cn(
        "group h-full flex flex-col transition-all duration-200 overflow-hidden border border-gray-200 bg-white",
        isActive 
          ? "hover:border-primary/50 hover:shadow-md" 
          : "opacity-70 border-dashed"
      )}
    >
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          {getIcon(icon)}
          {statusConfig && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                statusConfig.className
              )}
            >
              {statusConfig.icon}
              {statusConfig.text}
            </Badge>
          )}
        </div>
        
        <div className="mt-2 flex-1">
          <h3 className={cn(
            "font-semibold text-lg mb-1.5 text-gray-900",
            !isActive && "text-gray-500"
          )}>
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant={isActive ? "default" : "outline"} 
          className={cn(
            "w-full group-hover:gap-2 transition-[gap] justify-center",
            !isActive && "bg-transparent text-gray-500"
          )}
          disabled={!isActive}
        >
          {isActive ? (
            <>
              <Button className="mt-4 mb-4 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-200 hover:bg-black hover:text-white hover:border-none" variant="outline" disabled={!isActive}>
          Open Tool
        </Button>
            </>
          ) : (
            'Coming Soon'
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  if (!isActive) {
    return (
      <div className="relative h-full">
        {content}
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isExternal) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return (
    <Link href={link} className="block h-full">
      {content}
    </Link>
  );
}
