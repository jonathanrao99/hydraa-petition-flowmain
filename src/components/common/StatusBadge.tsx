
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Pending" | "Assigned" | "Under Investigation" | "Decision Made";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800";
      case "Under Investigation":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800";
      case "Decision Made":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  return (
    <Badge className={cn("font-medium", getStatusStyles(), className)} variant="outline">
      {status}
    </Badge>
  );
};

export default StatusBadge;
