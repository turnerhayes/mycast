"use client";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import { useAppSelector } from "@/lib/redux/hooks";
import { getPodcasts } from "@/lib/redux/selectors";
import { Podcast } from "@/app/podcast";
import { PodcastImage } from "@/app/components/PodcastImage";
import { Typography } from "@mui/material";
import Link from "next/link";


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
}

export const Home = () => {
    const podcasts = useAppSelector(getPodcasts);

    return (
        <Stack>
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