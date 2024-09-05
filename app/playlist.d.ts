import { EpisodeId, PodcastId } from "@/app/podcast";

export type PlaylistId = string;

export const DEFAULT_PLAYLIST_ID: PlaylistId = "";

export interface PodcastEpisodeId {
    podcastId: PodcastId;
    episodeId: EpisodeId;
};

export interface Playlist {
    id?: PlaylistId;
    name?: string;
    items: PodcastEpisodeId[];
};

export interface CurrentlyPlayingEpisode {
    playlistId: PlaylistId;
    index: number;
}
