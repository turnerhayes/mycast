"use client";

import { useCallback, useEffect, useRef } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Podcast, PodcastEpisode } from "@/app/podcast";
import { EpisodeImage } from "@/app/components/EpisodeImage";
import { Description } from "@/app/components/Description";
import { DownloadButton } from "@/app/components/DownloadButton";
import { PlaylistButton } from "@/app/components/PlaylistButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import { DEFAULT_PLAYLIST_ID } from "@/app/playlist.d";
import { getEpisodeAudioFromFile, removePodcastEpisodeFile } from "@/app/filesystem";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setEpisodeProgress } from "@/lib/redux/slices/podcast";
import { getEpisodeLastListenTime } from "@/lib/redux/selectors";
import { addAndPlayItem, addPlaylistItem } from "@/lib/redux/slices/playlist";

import 'react-h5-audio-player/lib/styles.css';


export const EpisodeDetail = (
    {
        episode,
        podcast,
    }: {
        episode: PodcastEpisode;
        podcast: Podcast;
    }
) => {
    const playerRef = useRef<H5AudioPlayer | null>(null);
    const dispatch = useAppDispatch();

    const currentEpisodeProgress = useAppSelector((state) => getEpisodeLastListenTime(state, {
        podcastId: podcast.id,
        episodeId: episode.id,
    }));

    useEffect(() => {
        getEpisodeAudioFromFile(podcast.id, episode.id).then(async (file) => {
            if (file && file.size === 0) {
                await removePodcastEpisodeFile(podcast.id, episode.id);
                return;
            }
            const url = file ?
                URL.createObjectURL(file) :
                episode.enclosure.url;
            const audioEl = playerRef.current?.audio.current;
            if (!audioEl) {
                return;
            }
            audioEl.src = url;
        });

        if (currentEpisodeProgress) {
            const audioRef = playerRef.current?.audio.current;
            if (audioRef) {
                audioRef.currentTime = currentEpisodeProgress;
            }
        }
    }, [
        podcast,
        episode,
        currentEpisodeProgress,
    ]);


    const handleListen = useCallback((event: Event) => {
        const { currentTime } = event.target as HTMLAudioElement;
        dispatch(setEpisodeProgress({
            podcastId: podcast.id,
            episodeId: episode.id,
            lastListenTime: currentTime,
        }));
    }, [
        podcast,
        episode,
        dispatch,
    ]);

    const handleAddToPlaylist = useCallback(() => {
        dispatch(addPlaylistItem({
            episodeId: {
                podcastId: podcast.id,
                episodeId: episode.id,
            },
        }));
    }, [
        dispatch,
        podcast,
        episode,
    ]);

    const handlePlayNext = useCallback(() => {
        dispatch(addPlaylistItem({
            episodeId: {
                podcastId: podcast.id,
                episodeId: episode.id,
            },
        }));
    }, [
        dispatch,
        podcast,
        episode,
    ]);

    const handlePlayButtonClick = useCallback(() => {
        dispatch(addAndPlayItem({
            playlistId: DEFAULT_PLAYLIST_ID,
            episodeId: {
                podcastId: podcast.id,
                episodeId: episode.id,
            },
        }));
    }, [
        dispatch,
        episode,
        podcast,
    ]);

    return (
        <Stack>
            <Container
                component="header"
                sx={{
                    padding: 1,
                }}
            >
                <EpisodeImage
                    episode={episode}
                    podcastId={podcast.id}
                    sx={{
                        float: "left",
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    {podcast.title}
                </Typography>
                <Typography
                    variant="h3"
                >
                    {episode.title}
                </Typography>
            </Container>
            <IconButton
                onClick={handlePlayButtonClick}
            >
                <PlayIcon />
            </IconButton>
            <Paper
                sx={{
                    marginTop: 1,
                    padding: 2,
                }}
            >
                <Description
                    typographyProps={{
                        sx: {
                            clear: "both",
                        },
                    }}
                >{
                        episode.description ?? ""
                    }</Description>
                <Container
                    sx={{
                        marginTop: 2,
                    }}
                >
                    <H5AudioPlayer
                        ref={playerRef}
                        header={
                            <>
                                {podcast.title} &mdash; {episode.title}
                            </>
                        }
                        onListen={handleListen}
                        customAdditionalControls={[
                            (
                                <DownloadButton
                                    key="download-button"
                                    podcast={podcast}
                                    episode={episode}
                                />
                            ),
                            (
                                <PlaylistButton
                                    key="playlist-button"
                                    onAddToPlaylist={handleAddToPlaylist}
                                    onPlayNext={handlePlayNext}
                                />
                            ),
                        ]}
                    ></H5AudioPlayer>
                </Container>
            </Paper>
        </Stack>
    );
};
