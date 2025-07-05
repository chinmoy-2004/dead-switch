import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../lib/utility.js"; // Utility to merge class names

// Tooltip context provider
const TooltipProvider = TooltipPrimitive.Provider;

// Root element for an individual tooltip
const Tooltip = TooltipPrimitive.Root;

// Element that triggers the tooltip on hover/focus
const TooltipTrigger = TooltipPrimitive.Trigger;

// The tooltip content (the actual floating text box)
const TooltipContent = React.forwardRef((props, ref) => {
  const { className, sideOffset = 4, ...rest } = props;

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...rest}
    />
  );
});

TooltipContent.displayName = "TooltipContent";

// Exporting components for use
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
// The TooltipContent component is a forwardRef component that allows it to be used with refs, which is useful for managing focus and other interactions in React.