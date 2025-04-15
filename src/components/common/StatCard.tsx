
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  variant?: "default" | "pending" | "complete" | "error" | "info" | "warning" | "not-started" | "success";
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
  variant = "default",
}: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "pending":
        return "bg-orange-50 border-orange-200"; // Soft orange for pending
      case "complete":
      case "success":
        return "bg-green-50 border-green-200"; // Green for completed/success
      case "error":
        return "bg-red-50 border-red-200"; // Red for errors
      case "info":
        return "bg-blue-50 border-blue-200"; // Blue for info
      case "warning":
        return "bg-yellow-50 border-yellow-200"; // Yellow for warnings
      case "not-started":
        return "bg-gray-50 border-gray-200"; // Grey for not started
      default:
        return "bg-white border-gray-100"; // Default is white
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "pending":
        return "text-orange-500";
      case "complete":
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "info":
        return "text-blue-500";
      case "warning":
        return "text-yellow-500";
      case "not-started":
        return "text-gray-500";
      default:
        return "text-muted-foreground/70";
    }
  };

  const getTrendStyles = () => {
    if (trend === "up") {
      return "text-green-500";
    } else if (trend === "down") {
      return "text-red-500";
    }
    return "text-gray-500";
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "pending":
        return "bg-orange-100";
      case "complete":
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      case "info":
        return "bg-blue-100";
      case "warning":
        return "bg-yellow-100";
      case "not-started":
        return "bg-gray-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <Card className={cn("overflow-hidden border transition-all hover:shadow-md", getVariantStyles(), className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className={cn("p-1.5 rounded-full", getIconStyles(), getBackgroundColor())}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            <span className={cn("text-xs font-medium", getTrendStyles())}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
