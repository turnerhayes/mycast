import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppHeader } from "@/app/components/AppHeader";
import StoreProvider from "./StoreProvider";

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
            <Stack
              component="main"
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <AppHeader
              />
              <Container
                sx={{
                  marginTop: 1,
                  flexGrow: 1,
                  overflowY: "auto",
                }}
              >
                {children}
              </Container>
            </Stack>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
