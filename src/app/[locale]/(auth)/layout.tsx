import type React from "react";
import { Card } from "@/components/ui/card";
import { AuthDescription } from "@/features/auth/components/auth-description";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-4xl flex flex-row rounded-lg overflow-hidden py-0 gap-0">
        <div className="w-1/2">
          <AuthDescription />
        </div>
        <div className="w-1/2">{children}</div>
      </Card>
    </div>
  );
}
