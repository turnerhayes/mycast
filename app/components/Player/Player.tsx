import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import H5AudioPlayer, {RHAP_UI} from "react-h5-audio-player";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PlaylistIcon from "@mui/icons-material/QueueMusic";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LinkIcon from "@mui/icons-material/Link";
import { DownloadButton } from "@/app/components/DownloadButton";
import { EpisodeLink } from "@/app/components/Links";
import { CurrentlyPlayingEpisode, DEFAULT_PLAYLIST_ID } from "@/app/playlist.d";
import { Podcast, PodcastEpisode } from "@/app/podcast";
import { getEpisodeAudioFromFile, removePodcastEpisodeFile } from "@/app/filesystem";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getCurrentlyPlaying, getEpisodeLastListenTime, getPlaylist, getPodcast, getPodcastEpisode } from "@/lib/redux/selectors";
import { completePlaylistItem, setCurrentlyPlaying } from "@/lib/redux/slices/playlist";
import { setEpisodeProgress } from "@/lib/redux/slices/podcast";

import 'react-h5-audio-player/lib/styles.css';


const EpisodeTitle = (
    {
        podcast,
        episode,
    }: {
        podcast: Podcast;
        episode: PodcastEpisode;
    }
) => {
    return (
        <>
            <Typography
                title={podcast.title}
                sx={{
                    display: "inline-block",
                    maxWidth: "40%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {podcast.title}
            </Typography>
            &mdash;
            <Typography
                title={episode.title}
                sx={{
                    display: "inline-block",
                    maxWidth: "40%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {episode.title}
            </Typography>
        </>
    );
};

export const Player = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const playerRef = useRef<H5AudioPlayer|null>(null);
    const currentEpisode = useAppSelector(getCurrentlyPlaying)!;
    const currentEpisodeRef = useRef<CurrentlyPlayingEpisode>();
    const playlist = useAppSelector(
        (state) => getPlaylist(state, currentEpisode.playlistId)
    );
    const episodeId = playlist.items[currentEpisode.index];

    const currentEpisodeProgress = useAppSelector(
        (state) => getEpisodeLastListenTime(
            state,
            episodeId,
        )
    );
    const podcast = useAppSelector((state) => getPodcast(state, {
        id: episodeId.podcastId,
    }));
    const episode = useAppSelector((state) => getPodcastEpisode(state, {
        id: episodeId.podcastId,
        episodeId: episodeId.episodeId,
    }));

    const [isExpanded, setIsExpanded] = useState(true);
    
    useEffect(() => {
        if (
            currentEpisodeRef.current?.index !== currentEpisode.index ||
            currentEpisodeRef.current?.playlistId !== currentEpisode.playlistId
        ) {
            const hasCurrentEpisode = Boolean(currentEpisodeRef.current);
            getEpisodeAudioFromFile(podcast!.id, episode!.id).then(
                async (file) => {
                    if (file && file.size === 0) {
                        await removePodcastEpisodeFile(
                            podcast!.id,
                            episode!.id
                        );
                        return;
                    }
                    const url = file ?
                        URL.createObjectURL(file) :
                        episode!.enclosure.url;
                    const audioEl = playerRef.current?.audio.current;
                    if (!audioEl) {
                        return;
                    }
                    audioEl.src = url;

                    if (hasCurrentEpisode) {
                        if (!audioEl?.paused && !audioEl?.ended) {
                            audioEl?.pause();
                        }
                        audioEl?.play();
                    }
                }
            );
    
            if (currentEpisodeProgress) {
                const audioRef = playerRef.current?.audio.current;
                if (audioRef) {
                    audioRef.currentTime = currentEpisodeProgress;
                }
            }
        }
        currentEpisodeRef.current = currentEpisode;
    }, [
        podcast,
        episode,
        playerRef,
        currentEpisodeRef,
        currentEpisode,
        currentEpisodeProgress,
    ]);
    
    const handleListen = useCallback((event: Event) => {
        const { currentTime } = event.target as HTMLAudioElement;
        dispatch(setEpisodeProgress({
            podcastId: episodeId.podcastId,
            episodeId: episodeId.episodeId,
            lastListenTime: currentTime,
        }));
    }, [
        episodeId,
        dispatch,
    ]);

    const handlePlaylistClick = useCallback(() => {
        router.push("/playlist");
    }, [
        router,
    ]);

    const handleExpandClick = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [
        isExpanded,
        setIsExpanded,
    ]);

    const handleEnded = useCallback(() => {
        dispatch(completePlaylistItem({
            playlistId: DEFAULT_PLAYLIST_ID,
            index: currentEpisode.index,
        }));
    }, [
        dispatch,
        currentEpisode.index,
    ]);

    const handlePreviousClick = useCallback(() => {
        const currentIndex = currentEpisode.index;
        if (currentIndex === 0) {
            return;
        }
        dispatch(setCurrentlyPlaying({
            playlistId: DEFAULT_PLAYLIST_ID,
            index: currentIndex - 1,
        }));
    }, [
        currentEpisode.index,
        dispatch,
    ]);

    const handleNextClick = useCallback(() => {
        const currentIndex = currentEpisode.index;

        if (currentIndex === playlist.items.length - 1) {
            return;
        }

        dispatch(setCurrentlyPlaying({
            playlistId: DEFAULT_PLAYLIST_ID,
            index: currentIndex + 1,
        }));
    }, [
        currentEpisode.index,
        dispatch,
    ]);

    if (!podcast) {
        return (
            <Typography>
                Podcast not found
            </Typography>
        );
    }

    if (!episode) {
        return (
            <Typography>
                Episode not found
            </Typography>
        );
    }

    return (
        <Container
            disableGutters
        >
            <H5AudioPlayer
                ref={playerRef}
                showSkipControls={isExpanded}
                showJumpControls={isExpanded}
                header={
                    <Container
                        disableGutters
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <EpisodeTitle
                            podcast={podcast}
                            episode={episode}
                        />
                        <EpisodeLink
                            podcastId={podcast.id}
                            episodeId={episode.id}
                        >
                            <LinkIcon />
                        </EpisodeLink>
                        <IconButton
                            onClick={handleExpandClick}
                            sx={{
                                marginLeft: "auto",
                            }}
                        >
                            {
                                isExpanded ? (
                                    <ExpandMoreIcon
                                        fontSize="small"
                                    />
                                ) : (
                                    <ExpandLessIcon
                                        fontSize="small"
                                    />
                                )
                            }
                        </IconButton>
                    </Container>
                }
                onListen={handleListen}
                onEnded={handleEnded}
                onClickPrevious={handlePreviousClick}
                onClickNext={handleNextClick}
                customControlsSection={
                    isExpanded ? [
                        RHAP_UI.ADDITIONAL_CONTROLS,
                        RHAP_UI.MAIN_CONTROLS,
                        RHAP_UI.VOLUME_CONTROLS,
                    ] : []
                }
                customAdditionalControls={[
                    (
                        <DownloadButton
                            key="download-button"
                            podcast={podcast}
                            episode={episode}
                        />
                    ),
                    (
                        <IconButton
                            key="playlist-button"
                            title="Playlist"
                            onClick={handlePlaylistClick}
                        >
                            <PlaylistIcon
                            />
                        </IconButton>
                    )
                ]}
            ></H5AudioPlayer>
        </Container>
    );
};
