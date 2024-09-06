import { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, SxProps } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { ChangeOnHover } from "@/app/components/ChangeOnHover";
import { PodcastEpisodeId } from "@/app/playlist";
import { getEpisodeAudioFromFile, getEpisodeFileHandle, removePodcastEpisodeFile } from "@/app/filesystem";
import { Podcast, PodcastEpisode } from "@/app/podcast";
import { DownloadWorkerMessageEvent, ProgressMessageData } from "./download-worker-types";

export const DownloadButton = (
    {
        podcast,
        episode,
        sx,
    }: {
        podcast: Podcast;
        episode: PodcastEpisode;
        sx?: SxProps;
    }
) => {
    const downloadWorkerRef = useRef<Worker>();
    const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
    const [isDownloaded, setIsDownloaded] = useState(false);

    
    useEffect(() => {
        getEpisodeAudioFromFile(podcast.id, episode.id).then(
            async (file) => {
                setIsDownloaded(Boolean(file));
            }
        );

    }, [
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

            const { body } = response;

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
                    const { data } = event as MessageEvent<ProgressMessageData>;
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
        },
        [
            setDownloadProgress,
            setIsDownloaded,
        ]
    );
    
    const handleRemove = useCallback(async () => {
        await removePodcastEpisodeFile(podcast.id, episode.id);
        setIsDownloaded(false);
    }, [
        podcast,
        episode,
        setIsDownloaded,
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
        downloadEpisodeAudio,
    ]);

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
                                color="action"
                            />
                        </IconButton>
                        <IconButton
                            className="hovered"
                            onClick={handleRemove}
                        >
                            <RemoveCircleIcon />
                        </IconButton>
                    </ChangeOnHover>
                ) : (
                    downloadProgress === null ? (
                        <IconButton
                            onClick={handleDownload}
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
