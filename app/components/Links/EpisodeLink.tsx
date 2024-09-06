import { ReactNode } from "react";
import { BaseLink } from "./BaseLink";
import { EpisodeId, PodcastId } from "@/app/podcast";
import { SxProps } from "@mui/material";

export const EpisodeLink = (
    {
        podcastId,
        episodeId,
        children,
        title,
        sx,
    }: {
        podcastId: PodcastId;
        episodeId: EpisodeId;
        children: ReactNode;
        title?: string;
        sx?: SxProps;
    }
) => (
    <BaseLink
        href={`/feed/${
            encodeURIComponent(podcastId)
        }/${
            encodeURIComponent(episodeId)
        }`}
        title={title}
        sx={sx}
    >
        {children}
    </BaseLink>
);
