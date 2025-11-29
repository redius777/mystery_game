import { cn } from "@/lib/utils";
import React from "react";

interface DecoLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DecoLayout({ children, className }: DecoLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground relative overflow-hidden", className)}>
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}
      />
      
      {/* Corner Ornaments */}
      <div className="fixed top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary z-50 opacity-50 pointer-events-none"></div>
      <div className="fixed top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary z-50 opacity-50 pointer-events-none"></div>
      <div className="fixed bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary z-50 opacity-50 pointer-events-none"></div>
      <div className="fixed bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary z-50 opacity-50 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 container py-8">
        {children}
      </div>
    </div>
  );
}

export function DecoCard({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={cn("bg-card/80 backdrop-blur-sm border border-primary/20 p-6 relative group", className)}>
      {/* Card Ornaments */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {title && (
        <div className="mb-4 text-center relative">
          <h3 className="font-display text-xl text-primary tracking-widest uppercase inline-block px-4 bg-card relative z-10">
            {title}
          </h3>
          <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20 -z-0"></div>
        </div>
      )}
      
      {children}
    </div>
  );
}
