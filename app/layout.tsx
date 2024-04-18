import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyCast",
  description: "Personal podcast app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <AppRouterCacheProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </AppRouterCacheProvider>
    </StoreProvider>
  );
}
