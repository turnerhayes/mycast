import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppHeader } from "@/app/components/AppHeader";
import StoreProvider from "@/app/StoreProvider";
import { App } from "@/app/App";

import "./globals.css";


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
    <html
      lang="en"
    >
      <body
        className={inter.className}
      >
        <StoreProvider>
          <AppRouterCacheProvider>
            <App>
              {children}
            </App>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
