"use client";
import { Button, Card, Title } from "@tremor/react";
import { Expense } from "../lib/type";
import { useSession, signIn, getSession, signOut } from "next-auth/react";

export const Profile = () => {
  const { data } = useSession();

  return (
    <>
      <Card>
        {data ? (
          <Button onClick={() => signOut()}>Sign Out</Button>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </Card>
    </>
  );
};
