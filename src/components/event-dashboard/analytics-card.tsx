import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  CheckCircle, 
  DollarSign, 
  Users, 
  QrCode,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function AnalyticsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon,
  description,
  trend = 'up'
}: AnalyticsCardProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = {
      'user-plus': UserPlus,
      'check-circle': CheckCircle,
      'dollar-sign': DollarSign,
      'users': Users,
      'qr-code': QrCode,
    }[iconName] || UserPlus;

    return (
      <div className={cn(
        "p-2 rounded-lg bg-gray-100 text-gray-900"
      )}>
        <IconComponent className="h-6 w-6" />
      </div>
    );
  };

  const getTrendIcon = (trend: string) => {
    const className = "h-3.5 w-3.5";
    
    switch (trend) {
      case 'up':
        return <ArrowUpRight className={cn(className, "text-green-500")} />;
      case 'down':
        return <ArrowDownRight className={cn(className, "text-red-500")} />;
      default:
        return <Minus className={cn(className, "text-muted-foreground")} />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-gray-900">
            {title}
          </CardTitle>
          <div className="p-1.5 rounded-md bg-gray-100 transition-colors">
            {getIcon(icon)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            getChangeColor(changeType)
          )}>
            {getTrendIcon(trend)}
            <span>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
