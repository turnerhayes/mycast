import { ReactNode } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Description } from "@/app/components/Description";
import { PodcastEpisode, PodcastId } from "@/app/podcast";
import { EpisodeImage } from "@/app/components/EpisodeImage";


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
        href={`/feed/${podcastId}/${episode.guid}`}
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
    return (
        <Stack>
            <Stack
                direction="row"
            >
                <EpisodeLink
                    podcastId={podcastId}
                    episode={episode}
                    >
                    <EpisodeImage
                        episode={episode}
                        podcastId={podcastId}
                    />
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
