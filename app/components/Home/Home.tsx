"use client";

import Link from "next/link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector } from "@/lib/redux/hooks";
import { getPodcasts } from "@/lib/redux/selectors";
import { Podcast } from "@/app/podcast";
import { PodcastImage } from "@/app/components/PodcastImage";
import { PodcastSearch } from "@/app/components/PodcastSearch";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useState } from "react";


const PodcastItem = (
    {
        podcast,
    }: {
        podcast: Podcast;
    }
) => {
    return (
        <MuiLink
            component={Link}
            href={`/feed/${podcast.id}`}
        >
            <Stack>
                <PodcastImage
                    podcast={podcast}
                />
                <Typography
                    variant="h6"
                    align="center"
                >
                    {podcast.title}
                </Typography>
            </Stack>
        </MuiLink>
    );
};

const PodcastSearchDialog = (
    {
        open,
        onClose,
    }: {
        open: boolean;
        onClose: () => void;
    }
) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "80vw",
                    height: "80vh",
                },
            }}
        >
            <DialogTitle>
                Add a Podcast
            </DialogTitle>
            <DialogContent>
                <PodcastSearch
                />
            </DialogContent>
        </Dialog>
    );
};

export const Home = () => {
    const podcasts = useAppSelector(getPodcasts);
    const [
        isAddPodcastDialogOpen,
        setIsAddPodcastDialogOpen
    ] = useState(false);

    const handleAddPodcastClick = useCallback(() => {
        setIsAddPodcastDialogOpen(true);
    }, [
        setIsAddPodcastDialogOpen,
    ]);

    const handleAddPodcastClose = useCallback(() => {
        setIsAddPodcastDialogOpen(false);
    }, [
        setIsAddPodcastDialogOpen,
    ]);

    return (
        <Stack>
            {/* <PodcastSearch
            /> */}
            <IconButton
                onClick={handleAddPodcastClick}
                sx={{
                    alignSelf: "flex-start",
                }}
            >
                <AddIcon />
            </IconButton>
            <PodcastSearchDialog
                open={isAddPodcastDialogOpen}
                onClose={handleAddPodcastClose}
            />
            <Grid container spacing={1}>
                {
                    podcasts.map((podcast) => (
                        <Grid
                            item
                            key={podcast.id}
                        >
                            <PodcastItem
                                podcast={podcast}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </Stack>
    );
};