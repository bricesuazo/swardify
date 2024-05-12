import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { cn } from "@swardify/ui";
import { Toaster } from "@swardify/ui/sonner";

import { TRPCReactProvider } from "~/trpc/client";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swardify",
  description: "A Bidirectional Swardspeak and Tagalog Translator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </head>
      <body className={cn(font.className, "h-full")}>
        <TRPCReactProvider>
          <Toaster />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
