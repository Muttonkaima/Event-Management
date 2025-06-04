import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  CheckCircle, 
  DollarSign, 
  Users, 
  QrCode 
} from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}

export default function AnalyticsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon 
}: AnalyticsCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "user-plus":
        return <UserPlus className="h-6 w-6 text-gray-900" />;
      case "check-circle":
        return <CheckCircle className="h-6 w-6 text-gray-900" />;
      case "dollar-sign":
        return <DollarSign className="h-6 w-6 text-gray-900" />;
      case "users":
        return <Users className="h-6 w-6 text-gray-900" />;
      case "qr-code":
        return <QrCode className="h-6 w-6 text-gray-900" />;
      default:
        return <UserPlus className="h-6 w-6 text-gray-900" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getIcon(icon)}
          </div>
          <Badge className={`text-xs ${getChangeColor(changeType)} hover:${getChangeColor(changeType)}`}>
            {change}
          </Badge>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
