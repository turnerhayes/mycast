import { ReactNode } from "react";
import { BaseLink } from "./BaseLink";
import { PodcastId } from "@/app/podcast";
import { SxProps } from "@mui/material";

export const PodcastLink = (
    {
        podcastId,
        children,
        title,
        sx,
    }: {
        podcastId: PodcastId;
        children: ReactNode;
        title?: string;
        sx?: SxProps;
    }
) => (
    <BaseLink
        href={`/feed/${encodeURIComponent(podcastId)}`}
        title={title}
        sx={sx}
    >
        {children}
    </BaseLink>
);
