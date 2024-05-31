"use client";

import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { LinearProgress, SxProps, alpha, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DownloadList, getDownloads, getUsage, removePodcastEpisodeFile, removePodcastFiles } from "@/app/filesystem";
import { EpisodeId, Podcast, PodcastId } from "@/app/podcast";
import { useAppSelector } from "@/lib/redux/hooks";
import { getPodcasts } from "@/lib/redux/selectors";
import { EpisodeLink, PodcastLink } from "../components/Links";


interface PodcastMapping {
    [podcastId: PodcastId]: {
        name: string;
        episodes: {
            [episodeId: EpisodeId]: string;
        }
    }
}

const getPodcastMapping = (
    podcasts: Podcast[]
): PodcastMapping => {
    const mapping: PodcastMapping = {};

    for (const podcast of podcasts) {
        mapping[podcast.id] = {
            name: podcast.title,
            episodes: podcast.episodes.reduce(
                (episodeMap, episode) => {
                    episodeMap[episode.id] = episode.title;

                    return episodeMap;
                },
                {} as {[episodeId: EpisodeId]: string} 
            ),
        }
    }

    return mapping;
};

const getSizeString = (size: number): string => {
    if (size < 1e3) {
        return `${size}B`;
    }

    if (size < 1e6) {
        return `${Math.round(size/1e3)}KB`;
    }

    if (size < 1e9) {
        return `${Math.round(size/1e6)}MB`;
    }

    return `${Math.round(size/1e9)}GB`;
};

const EpisodeListItem = (
    {
        podcastId,
        episodeId,
        episode,
        podcastMapping,
        onRemoveEpisode,
        sx,
    }: {
        podcastId: PodcastId;
        episodeId: EpisodeId;
        episode: DownloadList[PodcastId][EpisodeId];
        podcastMapping: PodcastMapping;
        onRemoveEpisode: (podcastId: PodcastId, episodeId: EpisodeId) => void;
        sx?: SxProps;
    }
) => {
    const handleRemoveEpisode = useCallback(() => {
        onRemoveEpisode(podcastId, episodeId);
    }, [
        podcastId,
        episodeId,
        onRemoveEpisode,
    ]);

    return (
        <ListItem
            key={episodeId}
            secondaryAction={
                <IconButton
                    onClick={handleRemoveEpisode}
                >
                    <DeleteIcon />
                </IconButton>
            }
            disableGutters
            sx={{
                ...sx,
            }}
        >
            <ListItemText
                secondary={
                    getSizeString(episode.size)
                }
            >
                <EpisodeLink
                    podcastId={podcastId}
                    episodeId={episodeId}
                >
                    {podcastMapping[podcastId].episodes[episodeId]}
                </EpisodeLink>
            </ListItemText>
        </ListItem>
    );
};

const PodcastList = (
    {
        podcastId,
        podcastMapping,
        downloadList,
        onRemovePodcast,
        onRemoveEpisode,
        backgroundColor,
    }: {
        podcastId: PodcastId;
        podcastMapping: PodcastMapping;
        downloadList: DownloadList;
        onRemovePodcast: (podcastId: PodcastId) => void;
        onRemoveEpisode: (podcastId: PodcastId, episodeId: EpisodeId) => void;
        backgroundColor?: string;
    }
) => {
    const handleRemovePodcast = useCallback(() => {
        onRemovePodcast(podcastId);
    }, [
        onRemovePodcast,
        podcastId,
    ]);

    return (
        <Fragment>
            <ListSubheader
                sx={{
                    backgroundColor,
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                >
                    <PodcastLink
                        podcastId={podcastId}
                    >
                        {podcastMapping[podcastId].name}
                    </PodcastLink>
                    <IconButton
                        onClick={handleRemovePodcast}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            </ListSubheader>
            <ListItem
                sx={{
                    backgroundColor,
                }}
            >
                <List
                    sx={{
                        width: "100%",
                        paddingLeft: 4,
                    }}
                >
                    {
                        Object.keys(downloadList[podcastId]).map(
                            (episodeId: EpisodeId) => (
                                <EpisodeListItem
                                    key={episodeId}
                                    podcastId={podcastId}
                                    episodeId={episodeId}
                                    episode={downloadList[podcastId][episodeId]}
                                    onRemoveEpisode={onRemoveEpisode}
                                    podcastMapping={podcastMapping}
                                />
                            )
                        )
                    }
                </List>
            </ListItem>
        </Fragment>
    );
};

const DownloadsPage = () => {
    const podcasts = useAppSelector(getPodcasts);
    const [downloadList, setDownloadList] = useState<DownloadList|null>(null);
    const [usage, setUsage] = useState<{
        quota: number;
        usage: number;
    }|null>(null);
    const theme = useTheme();

    const podcastMapping = useMemo(
        () => getPodcastMapping(podcasts),
        [
            podcasts,
        ]
    );

    useEffect(() => {
        getDownloads().then((list) => {
            setDownloadList(list);
        });

        getUsage().then((usage) => {
            if (!usage) {
                return;
            }

            setUsage(usage);
        });
    }, []);

    const handleRemovePodcast = useCallback(async (podcastId: PodcastId) => {
        await removePodcastFiles(podcastId);
        getDownloads().then((list) => {
            setDownloadList(list);
        });

        getUsage().then((usage) => {
            if (!usage) {
                return;
            }

            setUsage(usage);
        });
    }, [
        setDownloadList,
    ]);

    const handleRemoveEpisode = useCallback(
        async (podcastId: PodcastId, episodeId: EpisodeId) => {
            await removePodcastEpisodeFile(podcastId, episodeId);
            getDownloads().then((list) => {
                setDownloadList(list);
            });

            getUsage().then((usage) => {
                if (!usage) {
                    return;
                }
    
                setUsage(usage);
            });
        },
        [
            setDownloadList,
        ]
    );

    if (!downloadList) {
        return (
            <Stack>
                <CircularProgress
                />
                Loading...
            </Stack>
        );
    }

    if (Object.keys(downloadList).length === 0) {
        return (
            <Typography>
                No episodes downloaded.
            </Typography>
        );
    }

    let listIndex = 0;

    return (
        <Stack>
            {
                usage ? (
                    <Stack
                        direction="row"
                        alignItems="center"
                    >
                        <Typography
                            variant="caption"
                        >
                            Usage:
                        </Typography>
                        &nbsp;
                        <LinearProgress
                            variant="determinate"
                            value={(usage.usage/usage.quota) * 100}
                            sx={{
                                minWidth: 120,
                            }}
                        />
                        &nbsp;
                        <Typography
                            variant="caption"
                        >
                            {getSizeString(usage.usage)} out of {getSizeString(usage.quota)}
                        </Typography>
                    </Stack>
                ) :
                null
            }
            <List>
                {
                    Object.keys(downloadList).map(
                        (podcastId: PodcastId) => (
                            <PodcastList
                                key={podcastId}
                                podcastId={podcastId}
                                downloadList={downloadList}
                                podcastMapping={podcastMapping}
                                onRemovePodcast={handleRemovePodcast}
                                onRemoveEpisode={handleRemoveEpisode}
                                backgroundColor={
                                    listIndex++ % 2 === 1 ?
                                        alpha(theme.palette.common.black, 0.1) :
                                        undefined
                                }
                            />
                        )
                    )
                }
            </List>
        </Stack>
    );
};

export default DownloadsPage;
