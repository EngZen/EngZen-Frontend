import type React from "react";
import { Card } from "@/components/ui/card";
import { AuthDescription } from "@/features/auth/components/auth-description";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Card className="flex w-full max-w-4xl flex-row gap-0 overflow-hidden rounded-lg py-0">
        <div className="w-1/2">
          <AuthDescription />
        </div>
        <div className="w-1/2">{children}</div>
      </Card>
    </div>
  );
}
