import "./globals.css";
import { NextAuthProvider } from "./providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "My Mani",
  description: "See my spendings in a nice way",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body>{children}</body>
        <Analytics />
      </NextAuthProvider>
    </html>
  );
}
