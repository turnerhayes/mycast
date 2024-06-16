"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useAppSelector } from "@/lib/redux/hooks";
import { getDefaultPlaylist, getPodcastEpisodes } from "@/lib/redux/selectors";
import { Playlist } from "@/app/playlist";
import { EpisodeLink, PodcastLink } from "@/app/components/Links";


const PlaylistDisplay = (
    {
        playlist,
    }: {
        playlist: Playlist;
    }
) => {
    const podcastEpisodes = useAppSelector((state) => getPodcastEpisodes(state, playlist.items));
    
    if (playlist.items.length === 0) {
        return (
            <Typography>
                Playlist is empty
            </Typography>
        );
    }

    if (Object.values(podcastEpisodes).length < playlist.items.length) {
        throw new Error("Unable to find all episodes in playlist");
    }

    return (
        <List
            disablePadding
            dense
        >
            {
                playlist.items.map((id, index) => (
                    <ListItem
                        key={`${id.podcastId}>${id.episodeId}`}
                        disableGutters
                        secondaryAction={
                            <IconButton
                            >
                                <DragHandleIcon />
                            </IconButton>
                        }
                    >
                        <Typography
                            sx={{
                                marginRight: 2,
                            }}
                        >
                            {index + 1}. 
                        </Typography>
                        
                        <ListItemText>
                            <PodcastLink
                                podcastId={id.podcastId}
                            >
                                {
                                    podcastEpisodes[JSON.stringify(id)]!.podcast.title
                                }
                            </PodcastLink>
                            &nbsp; &mdash; &nbsp;
                            <EpisodeLink
                                podcastId={id.podcastId}
                                episodeId={id.episodeId}
                            >
                                {
                                    podcastEpisodes[JSON.stringify(id)]!.episode.title
                                }
                            </EpisodeLink>
                        </ListItemText>
                    </ListItem>
                ))
            }
        </List>
    );
};

export const PlaylistComponent = () => {
    const playlist = useAppSelector(getDefaultPlaylist);

    return (
        <Stack>
            <header>
                <Typography
                    variant="h3"
                >
                    Playlist
                </Typography>
            </header>
            <PlaylistDisplay
                playlist={playlist}
            />
        </Stack>
    );
};
