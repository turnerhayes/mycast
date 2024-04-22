"use client";

import Stack from "@mui/material/Stack";
import List from "@mui/material/List"; 
import ListItem from "@mui/material/ListItem"; 
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";
import { EpisodeItem } from "@/app/components/EpisodeItem";
import { Podcast } from "@/app/podcast";
import Link from "next/link";
import { PodcastImage } from "../PodcastImage";


export const Feed = (
    {
        podcast,
    }: {
        podcast: Podcast;
    }
) => {
    return (
        <Stack>
            <Stack
                direction="row"
            >
                <PodcastImage
                    podcast={podcast}
                />
                <Stack
                    sx={{
                        marginLeft: 1,
                    }}
                >
                    <Typography
                        variant="h2"
                    >
                        {podcast.title}
                    </Typography>
                    {
                        podcast.image?.link ? (
                            <IconButton
                                LinkComponent={Link}
                                href={podcast.image.link}
                                target="_blank"
                                sx={{
                                    alignSelf: "start",
                                }}
                            >
                                <LinkIcon />
                            </IconButton>
                        ) : null
                    }
                </Stack>
            </Stack>
            <List>
                {
                    podcast.episodes.map((ep) => (
                        <ListItem
                            key={ep.id}
                        >
                            <EpisodeItem
                                episode={ep}
                                podcastId={podcast.id}
                            />
                        </ListItem>
                    ))
                }
            </List>
        </Stack>
    );
};
