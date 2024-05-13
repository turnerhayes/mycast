export type PodcastId = string;

export type EpisodeId = string;

export interface PodcastOwner {
    name: string;
    email?: string;
}

export interface FeedImage {
    url: string;
    title?: string;
    link?: string;
}

export interface PodcastEpisodeEnclosure {
    length?: number;
    type: string;
    url: string;
}

export interface PodcastEpisode {
    id: EpisodeId;
    guid?: string;
    title: string;
    description?: string;
    publishedDateTimestamp?: number;
    imageUrl?: string;
    link?: string;
    episodeNumber?: number;
    durationSeconds?: number;
    isExplicit?: boolean;
    enclosure: PodcastEpisodeEnclosure;
}

export interface PodcastCategory {
    category: string;
    children?: PodcastCategory[];
};

export interface Podcast {
    id: PodcastId;
    url: string;
    title: string;
    author?: string;
    owner?: PodcastOwner;
    description?: string;
    language?: string;
    copyright?: string;
    image?: FeedImage;
    categories: PodcastCategory[];
    episodes: PodcastEpisode[];
}

export interface PodcastEpisodeProgress {
    lastListenTime: number;
    isComplete: boolean;
}

export interface PodcastProgress {
    [id: PodcastId]: {
        episodes: {
            [episodeId: EpisodeId]: PodcastEpisodeProgress;
        };
    };
}
