"use client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Command } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  const { data, status } = useSession();

  const isLoading = status === "loading";

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
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
                  onClick={() => signIn()}
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
