"use client";

import { useCallback } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PlayIcon from "@mui/icons-material/PlayArrow";
import { EpisodeLink, PodcastLink } from "@/app/components/Links";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getCurrentlyPlaying, getDefaultPlaylist, getPodcastEpisodes, PlaylistEpisodeDict } from "@/lib/redux/selectors";
import { CurrentlyPlayingEpisode, DEFAULT_PLAYLIST_ID, Playlist, PodcastEpisodeId } from "@/app/playlist.d";
import { setCurrentlyPlaying } from "@/lib/redux/slices/playlist";


const PlaylistItem = (
    {
        index,
        id,
        currentlyPlayingEpisode,
        podcastEpisodes,
        onPlay,
    }: {
        index: number;
        id: PodcastEpisodeId;
        currentlyPlayingEpisode: CurrentlyPlayingEpisode|null;
        podcastEpisodes: PlaylistEpisodeDict;
        onPlay: (index: number) => void;
    }
) => {
    const handlePlayButtonClick = useCallback(() => {
        onPlay(index);
    }, [
        onPlay,
        index,
    ]);

    return (
        <ListItem
            disableGutters
            secondaryAction={
                <IconButton
                >
                    <DragHandleIcon />
                </IconButton>
            }
        >
            <IconButton
                onClick={handlePlayButtonClick}
                disabled={index === currentlyPlayingEpisode?.index}
                sx={{
                    marginRight: 2,
                }}
            >
                {
                    index === currentlyPlayingEpisode?.index ? (
                        <EqualizerIcon />
                    ) : (
                        <PlayIcon />
                    )
                }
            </IconButton>
            
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
    );
};

const PlaylistDisplay = (
    {
        playlist,
    }: {
        playlist: Playlist;
    }
) => {
    const dispatch = useAppDispatch();
    const podcastEpisodes = useAppSelector((state) => getPodcastEpisodes(state, playlist.items));
    const currentlyPlayingEpisode = useAppSelector(getCurrentlyPlaying);

    const handlePlayItem = useCallback((index: number) => {
        dispatch(setCurrentlyPlaying({
            index,
            playlistId: DEFAULT_PLAYLIST_ID,
        }));
    }, [
        dispatch,
    ]);
    
    if (playlist.items.length === 0) {
        return (
            <Typography>
                Playlist is empty
            </Typography>
        );
    }

    if (playlist.items.some((item) => !(JSON.stringify(item) in podcastEpisodes))) {
        throw new Error("Unable to find all episodes in playlist");
    }

    return (
        <List
            disablePadding
            dense
        >
            {
                playlist.items.map((id, index) => (
                    <PlaylistItem
                        key={index}
                        id={id}
                        index={index}
                        currentlyPlayingEpisode={currentlyPlayingEpisode}
                        podcastEpisodes={podcastEpisodes}
                        onPlay={handlePlayItem}
                    />
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
