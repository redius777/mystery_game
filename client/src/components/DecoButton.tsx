import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface DecoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export function DecoButton({ className, variant = "primary", size = "default", children, ...props }: DecoButtonProps) {
  const baseStyles = "font-sans tracking-widest uppercase font-bold transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary/50",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/50",
  };

  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-9 px-4 text-xs",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <Button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
      
      {/* Corner Accents for Primary/Outline */}
      {(variant === "primary" || variant === "outline") && (
        <>
          <div className="absolute top-0 left-0 w-1 h-1 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </>
      )}
    </Button>
  );
}
