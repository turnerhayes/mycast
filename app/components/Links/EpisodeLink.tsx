import { ReactNode } from "react";
import { BaseLink } from "./BaseLink";
import { EpisodeId, PodcastId } from "@/app/podcast";

export const EpisodeLink = (
    {
        podcastId,
        episodeId,
        children,
    }: {
        podcastId: PodcastId;
        episodeId: EpisodeId;
        children: ReactNode;
    }
) => (
    <BaseLink
        href={`/feed/${
            encodeURIComponent(podcastId)
        }/${
            encodeURIComponent(episodeId)
        }`}
    >
        {children}
    </BaseLink>
);
