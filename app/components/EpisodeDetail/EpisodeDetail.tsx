"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import Stack from "@mui/material/Stack";
import { Collapse, Paper, SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { EpisodeId, Podcast, PodcastEpisode, PodcastId } from "@/app/podcast";
import { EpisodeImage } from "@/app/components/EpisodeImage";
import { Description } from "@/app/components/Description";
import { ChangeOnHover } from "@/app/components/ChangeOnHover";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setEpisodeProgress } from "@/lib/redux/slices/podcast";
import { getEpisodeLastListenTime } from "@/lib/redux/selectors";

import 'react-h5-audio-player/lib/styles.css';
import { getEpisodeAudioFromFile, getEpisodeFileHandle, removePodcastEpisodeFile } from "@/app/filesystem";
import { DownloadWorkerMessageEvent, ProgressMessageData } from "./download-worker-types";


const DownloadButton = (
    {
        isDownloaded,
        downloadProgress,
        onDownload,
        onRemove,
        sx,
    }: {
        isDownloaded: boolean;
        downloadProgress: number|null;
        onDownload: () => void;
        onRemove: () => void;
        sx?: SxProps;
    }
) => {
    return (
        <Box
            sx={{
                position: "relative",
                ...sx,
            }}
        >
            {
                isDownloaded ? (
                    <ChangeOnHover>
                        <IconButton
                            disabled
                        >
                            <DownloadDoneIcon
                                // sx={{
                                //     marginLeft: "8px",
                                //     marginTop: "8px",
                                // }}
                                color="action"
                            />
                        </IconButton>
                        <IconButton
                            className="hovered"
                            onClick={onRemove}
                        >
                            <RemoveCircleIcon />
                        </IconButton>
                    </ChangeOnHover>
                ) : (
                    downloadProgress === null ? (
                        <IconButton
                            onClick={onDownload}
                        >
                            <DownloadIcon
                            />
                        </IconButton>
                    ) : (
                        <>
                            <DownloadIcon
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    left: 8,
                                }}
                            />
                            <CircularProgress
                                variant="determinate"
                                value={downloadProgress}
                            >
                            </CircularProgress>
                        </>
                    )
                )
            }
        </Box>
    );
};

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
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState<number|null>(null);
    const downloadWorkerRef = useRef<Worker>();
    const dispatch = useAppDispatch();

    const currentEpisodeProgress = useAppSelector((state) => getEpisodeLastListenTime(state, {
        podcastId: podcast.id,
        episodeId: episode.id,
    }));

    let mounted = false;
    useEffect(() => {
        if (!mounted) {
            getEpisodeAudioFromFile(podcast.id, episode.id).then(async (file) => {
                if (file && file.size === 0) {
                    await removePodcastEpisodeFile(podcast.id, episode.id);
                    return;
                }
                setIsDownloaded(Boolean(file));
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
        }

        mounted = true;
    }, [
        mounted,
        podcast,
        episode,
        setIsDownloaded,
    ]);

    
    const downloadEpisodeAudio = useCallback(
        async (episode: PodcastEpisode, fileHandle: FileSystemFileHandle) => {
            downloadWorkerRef.current = new Worker(
                new URL("./download-worker.ts", import.meta.url)
            );
            setDownloadProgress(0);
            const response = await fetch(`/api/proxy/${encodeURIComponent(episode.enclosure.url)}`);

            const {body, headers} = response;
            
            const reader = body?.getReader();

            if (!reader) {
                throw new Error("Can't get body reader for episode audio");
            }

            const writable = await fileHandle.createWritable();
            writable.truncate(0);

            downloadWorkerRef.current.onmessage = (
                event: DownloadWorkerMessageEvent
            ) => {
                if (event.data.type === "progress") {
                    const {data} = event as MessageEvent<ProgressMessageData>;
                    setDownloadProgress(data.percentDone);

                    writable.write(data.value);
                    return;
                }

                if (event.data.type === "download-done") {
                    setIsDownloaded(true);
                    setDownloadProgress(null);

                    writable.close();
                    downloadWorkerRef.current?.terminate();
                    downloadWorkerRef.current = undefined;
                    return;
                }
            };

            downloadWorkerRef.current.postMessage({
                type: "download",
                url: `/api/proxy/${encodeURIComponent(episode.enclosure.url)}`,
            });
        }, [
            episode,
            setDownloadProgress,
            setIsDownloaded,
        ]
    );

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

    const handleDownload = useCallback(async () => {
        await removePodcastEpisodeFile(podcast.id, episode.id);
        const handle = await getEpisodeFileHandle(podcast.id, episode.id, true);
        if (!handle) {
            throw new Error(`Unable to get file handle for episode ${episode.id}`);
        }
        await downloadEpisodeAudio(episode, handle);
    }, [
        podcast,
        episode,
    ]);

    const handleRemove = useCallback(async () => {
        await removePodcastEpisodeFile(podcast.id, episode.id);
        setIsDownloaded(false);
    }, [
        podcast,
        episode,
        setIsDownloaded,
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
                                    downloadProgress={downloadProgress}
                                    isDownloaded={isDownloaded}
                                    onDownload={handleDownload}
                                    onRemove={handleRemove}
                                />
                            ),
                        ]}
                    ></H5AudioPlayer>
                </Container>
            </Paper>
        </Stack>
    );
};
