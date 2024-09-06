"use client";

import { ReactNode, useCallback, useState } from "react";
import Link from "next/link";
import { ThemeProvider, createTheme } from "@mui/material";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { AppHeader } from "@/app/components/AppHeader";
import { Player } from "@/app/components/Player";
import { BaseLink } from "@/app/components/Links";
import { ApolloWrapper } from "@/app/data/podcasts_client";
import { themeOptions } from "@/app/theme";
import { useAppSelector } from "@/lib/redux/hooks";
import { getCurrentlyPlaying } from "@/lib/redux/selectors";

export const App = (
    {
        children,
    }: {
        children: ReactNode;
    }
) => {
    const currentEpisode = useAppSelector(getCurrentlyPlaying);
    const theme = createTheme(themeOptions);
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
        <ThemeProvider theme={theme}>
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
                        PaperProps={{
                            sx: {
                                backgroundColor: theme.palette.primary.light,
                            },
                        }}
                    >
                        <List
                        >
                            <ListItemButton>
                                <BaseLink
                                    component={Link}
                                    href="/"
                                    sx={{
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    Home
                                </BaseLink>
                            </ListItemButton>
                            <ListItemButton>
                                <BaseLink
                                    component={Link}
                                    href="/downloads"
                                    sx={{
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    Downloads
                                </BaseLink>
                            </ListItemButton>
                            <ListItemButton>
                                <BaseLink
                                    component={Link}
                                    href="/search"
                                >
                                    Search
                                </BaseLink>
                            </ListItemButton>
                            <ListItemButton>
                                <BaseLink
                                    component={Link}
                                    href="/playlist"
                                >
                                    Playlist
                                </BaseLink>
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
                {
                    currentEpisode === null ? null : (
                        <Player
                        />
                    )
                }
            </Stack>
        </ThemeProvider>
    );
};
