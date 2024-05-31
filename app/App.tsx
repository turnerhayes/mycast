"use client";

import { ReactNode, useCallback, useState } from "react";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { AppHeader } from "@/app/components/AppHeader";
import { ApolloWrapper } from "@/app/data/podcasts_client";
import Link from "next/link";

export const App = (
    {
        children,
    }: {
        children: ReactNode;
    }
) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleToggleMenu = useCallback(() => {
      setIsMenuOpen(!isMenuOpen);
    }, [
      isMenuOpen,
      setIsMenuOpen,
    ]);

    const handleMenuClose = useCallback(() => {
        setIsMenuOpen(false);
    }, [
        setIsMenuOpen,
    ]);
  
    return (
        <Stack
            component="main"
            sx={{
                width: "100%",
                height: "100%",
            }}
        >
            <nav>
                <Drawer
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    keepMounted
                >
                    <List>
                        <ListItemButton>
                            <MuiLink
                                component={Link}
                                href="/"
                            >
                                Home
                            </MuiLink>
                        </ListItemButton>
                        <ListItemButton>
                            <MuiLink
                                component={Link}
                                href="/downloads"
                            >
                                Downloads
                            </MuiLink>
                        </ListItemButton>
                    </List>
                </Drawer>
            </nav>
            <AppHeader
                onToggleMenu={handleToggleMenu}
            />
            <Container
                sx={{
                    marginTop: 1,
                    flexGrow: 1,
                    overflowY: "auto",
                }}
            >
                <ApolloWrapper>
                    {children}
                </ApolloWrapper>
            </Container>
        </Stack>
    );
};
