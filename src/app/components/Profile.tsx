"use client";
import { Button, Title } from "@tremor/react";
import { Card } from "@/components/ui/card";

import { useSession, signIn, getSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Profile = () => {
  const { data } = useSession();

  return (
    <>
      <Card className="p-5 w-[100%]">
        {data ? (
          <>
            <Avatar>
              <AvatarImage src={data.user?.image || undefined} />
              <AvatarFallback>{data.user?.name}</AvatarFallback>
            </Avatar>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </Card>
    </>
  );
};
