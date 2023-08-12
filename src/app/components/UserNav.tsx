"use client";
import { useEffect } from "react";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { identify, page, track } from "../lib/analytics";

export function UserNav() {
  const { data } = useSession();

  useEffect(() => {
    track("PAGE_VIEWED");

    if (data?.user) {
      const { user } = data;

      if (!user.email) return;
      identify(user.email);
    }
  }, [data, data?.user]);

  if (!data)
    return (
      <Button
        onClick={() => {
          signIn();
          track("BUTTON_CLICKED", {
            text: "Log in",
            location: "User Nav",
          });
        }}
      >
        Connect Splitwise
      </Button>
    );
  const { user } = data;
  if (!user) return null;
  const { image, name, email } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="relative rounded-full gap-2"
          onClick={() => {
            track("BUTTON_CLICKED", {
              text: name?.split(" ")[0],
              location: "User Nav",
            });
          }}
        >
          {name?.split(" ")[0]}
          <Avatar className="h-8 w-8">
            <AvatarImage src={image || undefined} alt={name || ""} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            track("BUTTON_CLICKED", {
              text: "Log out",
              location: "User Nav",
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
