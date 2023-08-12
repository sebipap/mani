"use client";
import { Command } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { track } from "../lib/analytics";

export default function AuthenticationPage() {
  const { status } = useSession();
  const isLoading = status === "loading";

  return (
    <>
      <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" /> mani
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Connect your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your Splitwise account to start using the app.
              </p>
            </div>
            <div>
              <div className={"grid gap-6"}>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    signIn();
                    track("BUTTON_CLICKED", {
                      text: isLoading ? "Loading..." : "Get Started",
                      location: "AuthenticationPage",
                    });
                  }}
                >
                  {isLoading ? "Loading..." : "Get Started"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
