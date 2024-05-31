import { ReactNode } from "react";
import { BaseLink } from "./BaseLink";
import { PodcastId } from "@/app/podcast";

export const PodcastLink = (
    {
        podcastId,
        children,
    }: {
        podcastId: PodcastId;
        children: ReactNode;
    }
) => (
    <BaseLink
        href={`/feed/${encodeURIComponent(podcastId)}`}
    >
        {children}
    </BaseLink>
);
