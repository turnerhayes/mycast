import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Badge from "@mui/material/Badge";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { Description } from "@/app/components/Description";
import { PodcastEpisode, PodcastId } from "@/app/podcast";
import { EpisodeImage } from "@/app/components/EpisodeImage";
import { getEpisodeAudioFromFile } from "@/app/filesystem";


interface EpisodeItemProps {
    episode: PodcastEpisode;
    podcastId: PodcastId;
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat();

const EpisodeLink = (
    {
        podcastId,
        episode,
        children,
    }: Pick<EpisodeItemProps, "episode"|"podcastId"> & {
        children: ReactNode;
    }
) => (
    <MuiLink
        component={Link}
        href={`/feed/${encodeURIComponent(podcastId)}/${encodeURIComponent(episode.id)}`}
    >
        {children}
    </MuiLink>
);

export const EpisodeItem = (
    {
        episode,
        podcastId,
    }: EpisodeItemProps
) => {
    const [isDownloaded, setIsDownloaded] = useState(false);

    useEffect(() => {
        getEpisodeAudioFromFile(podcastId, episode.id).then(async (file) => {
            if (file && file.size === 0) {
                return;
            }
            setIsDownloaded(Boolean(file));
        });

    }, [
        podcastId,
        episode,
        setIsDownloaded,
    ]);

    return (
        <Stack>
            <Stack
                direction="row"
            >
                <EpisodeLink
                    podcastId={podcastId}
                    episode={episode}
                    >
                    <Badge
                        badgeContent={
                            isDownloaded ?
                                (
                                    <DownloadDoneIcon
                                        sx={{
                                            fontSize: "12px",
                                        }}
                                    />
                                ) : null
                        }
                        color="secondary"
                        overlap="circular"
                        title="Episode downloaded"
                    >
                        <EpisodeImage
                            episode={episode}
                            podcastId={podcastId}
                        />
                    </Badge>
                </EpisodeLink>
                <Stack>
                    <EpisodeLink
                        podcastId={podcastId}
                        episode={episode}
                    >
                        <Typography
                            variant="h4"
                        >
                            {episode.title}
                        </Typography>
                    </EpisodeLink>
                    <Typography
                        variant="caption"
                    >
                        Published {DATE_TIME_FORMATTER.format(episode.publishedDateTimestamp)}
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                    >
                        {
                            episode.description ? (
                                <Description>{
                                    episode.description
                                }</Description>
                            ) : null
                        }
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};
