"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

const LoginTabs = TabsPrimitive.Root;

const LoginTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground/70",
      className,
    )}
    {...props}
  />
));
LoginTabsList.displayName = TabsPrimitive.List.displayName;

const LoginTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium outline-offset-2 transition-all hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-black/5",
      className,
    )}
    {...props}
  />
));
LoginTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const LoginTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70",
      className,
    )}
    {...props}
  />
));
LoginTabsContent.displayName = TabsPrimitive.Content.displayName;

export { LoginTabs, LoginTabsList, LoginTabsTrigger, LoginTabsContent };
