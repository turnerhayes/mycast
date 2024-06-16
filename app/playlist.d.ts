import { EpisodeId, PodcastId } from "@/app/podcast";

export interface PodcastEpisodeId {
    podcastId: PodcastId;
    episodeId: EpisodeId;
};

export interface Playlist {
    name?: string;
    items: PodcastEpisodeId[];
};