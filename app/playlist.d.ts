import { EpisodeId, PodcastId } from "@/app/podcast";

export type PlaylistId = string;

export interface PodcastEpisodeId {
    podcastId: PodcastId;
    episodeId: EpisodeId;
};

export interface Playlist {
    id?: PlaylistId;
    name?: string;
    items: PodcastEpisodeId[];
};

export readonly interface CurrentlyPlayingEpisode {
    podcastEpisodeId: PodcastEpisodeId;
    playlistId: PlaylistId|null;
}
