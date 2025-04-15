
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  tooltip?: string;
  className?: string;
  showLogo?: boolean;
}

const PageHeader = ({ 
  title, 
  description, 
  action, 
  tooltip, 
  className,
  showLogo = true
}: PageHeaderProps) => {
  const header = (
    <div className={cn(
      "flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:gap-0",
      className
    )}>
      <div className="flex items-center gap-3">
        {showLogo && (
          <img 
            src="/lovable-uploads/f5e69450-5a4c-4abf-81ba-4369d2545598.png" 
            alt="HYDRAA Logo" 
            className="h-8 w-auto hidden sm:block" 
          />
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{header}</TooltipTrigger>
          <TooltipContent align="start" className="max-w-sm p-4 bg-white text-gray-800 shadow-lg rounded-lg">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return header;
};

export default PageHeader;
