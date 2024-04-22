"use client";

import { useCallback, useEffect, useRef } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AudioPlayer from "react-h5-audio-player";
import { Podcast, PodcastEpisode } from "@/app/podcast";
import { EpisodeImage } from "@/app/components/EpisodeImage";
import { Description } from "@/app/components/Description";

import 'react-h5-audio-player/lib/styles.css';
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setEpisodeProgress } from "@/lib/redux/slices/podcast";
import { getEpisodeLastListenTime } from "@/lib/redux/selectors";
import { Container } from "@mui/material";

export const EpisodeDetail = (
    {
        episode,
        podcast,
    }: {
        episode: PodcastEpisode;
        podcast: Podcast;
    }
) => {
    const playerRef = useRef<H5AudioPlayer|null>(null);
    const dispatch = useAppDispatch();

    const currentEpisodeProgress = useAppSelector((state) => getEpisodeLastListenTime(state, {
        podcastId: podcast.id,
        episodeId: episode.id,
    }));

    let mounted = false;
    useEffect(() => {
        if (!mounted) {
            if (currentEpisodeProgress) {
                const audioRef = playerRef.current?.audio.current;
                if (audioRef) {
                    audioRef.currentTime = currentEpisodeProgress;
                }
            }
        }

        mounted = true;
    }, [
        mounted,
    ]);

    const handleListen = useCallback((event: Event) => {
        const {currentTime} = event.target as HTMLAudioElement;
        dispatch(setEpisodeProgress({
            podcastId: podcast.id,
            episodeId: episode.id,
            lastListenTime: currentTime,
        }));
    }, [
        podcast,
        episode,
    ]);

    return (
        <Stack>
            <Stack
                component="header"
                direction="row"
                sx={{
                    padding: 1,
                }}
            >
                <EpisodeImage
                    episode={episode}
                    podcastId={podcast.id}
                />
                <Stack>
                    <Typography
                        variant="h4"
                    >
                        {podcast.title}
                    </Typography>
                    <Typography
                        variant="h3"
                    >
                        {episode.title}
                    </Typography>
                </Stack>
            </Stack>
            <Description
            >{
                episode.description ?? ""
            }</Description>
            <Container
                sx={{
                    marginTop: 2,
                }}
            >
                <AudioPlayer
                    ref={playerRef}
                    header={
                        <>
                            {podcast.title} &mdash; {episode.title}
                        </>
                    }
                    src={episode.enclosure.url}
                    onListen={handleListen}
                ></AudioPlayer>
            </Container>
        </Stack>
    );
};
