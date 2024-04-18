"use client";

import Stack from "@mui/material/Stack";
import List from "@mui/material/List"; 
import ListItem from "@mui/material/ListItem"; 
import Typography from "@mui/material/Typography";
import { EpisodeItem } from "@/app/components/EpisodeItem";
import { Podcast } from "@/app/podcast";
import { Container } from "@mui/material";


const PODCAST_IMAGE_SIZE = 250;

export const Feed = (
    {
        podcast,
    }: {
        podcast: Podcast;
    }
) => {
    return (
        <div>
            <Stack
                direction="row"
            >
                <Container
                    sx={{
                        width: PODCAST_IMAGE_SIZE,
                        minWidth: PODCAST_IMAGE_SIZE,
                        height: PODCAST_IMAGE_SIZE,
                    }}
                >
                    {
                        podcast.image ? (
                            <img
                                src={podcast.image.url}
                                alt={podcast.image.title ?? `Image for ${podcast.title} podcast`}
                                title={podcast.image.title}
                                style={{
                                    width: "100%",
                                }}
                            />
                        ) : (
                            <div>
                            </div>
                        )
                    }
                </Container>
                <Typography
                    variant="h2"
                >
                    {podcast.title}
                </Typography>
            </Stack>
            <List>
                {
                    podcast.episodes.map((ep) => (
                        <ListItem
                            key={ep.guid}
                        >
                            <EpisodeItem
                                episode={ep}
                                podcastId={podcast.id}
                            />
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );
};
