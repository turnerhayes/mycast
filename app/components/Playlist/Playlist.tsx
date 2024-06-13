"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/lib/redux/hooks";

export const Playlist = () => {
    const playlist = useAppSelector(() => ([]));

    return (
        <Stack>
            <header>
                <Typography
                    variant="h3"
                >
                    Playlist
                </Typography>
            </header>
            
        </Stack>
    );
};
