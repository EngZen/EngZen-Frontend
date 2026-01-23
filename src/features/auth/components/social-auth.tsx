"use client";

import { Chrome, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "../services/auth-service";

export function SocialAuth() {
  const handleSocialLogin = (provider: "google" | "facebook") => {
    authService.socialLogin(provider);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        type="button"
        onClick={() => handleSocialLogin("google")}
        className="w-full"
      >
        <Chrome className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => handleSocialLogin("facebook")}
        className="w-full"
      >
        <Facebook className="mr-2 h-4 w-4" />
        Facebook
      </Button>
    </div>
  );
}
