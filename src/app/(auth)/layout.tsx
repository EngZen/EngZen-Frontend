import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">EngZen</h1>
          <p className="text-muted-foreground mt-2">
            Elevate your English journey
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
