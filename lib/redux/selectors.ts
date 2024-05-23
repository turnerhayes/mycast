import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";
import { EpisodeId, PodcastId } from "@/app/podcast";

export const getPodcasts = (state: RootState) => state.podcast.items;

export const getPodcast = createSelector(
    [
        getPodcasts,
        (state: RootState, params: {id: PodcastId;}) => params.id,
    ],
    (podcasts, id) => podcasts.find((podcast) => podcast.id === id)
);

export const getPodcastByFeedUrl = createSelector(
    [
        getPodcasts,
        (state: RootState, params: {url: string;}) => params.url,
    ],
    (podcasts, url) => podcasts.find((podcast) => podcast.feedUrl === url)
);

export const getPodcastEpisode = createSelector(
    [
        getPodcast,
        (state: RootState, params: {episodeId: EpisodeId;}) => params.episodeId,
    ],
    (podcast, episodeId) => podcast?.episodes.find((ep) => ep.id === episodeId)
);

const getEpisodeProgress = createSelector(
    [
        (state: RootState) => state.podcast.podcastProgress,
        (state: RootState, params: {
            podcastId: PodcastId;
            episodeId: EpisodeId;
        }) => params,
    ],
    (progress, {podcastId, episodeId}) => progress[podcastId]?.
        episodes[episodeId]
);

export const getPodcastEpisodeProgress = createSelector(
    [
        (state: RootState) => state.podcast.podcastProgress,
        (state: RootState, params: {
            podcastId: PodcastId;
        }) => params.podcastId,
    ],
    (progress, podcastId) => progress[podcastId]
);

export const getEpisodeLastListenTime = createSelector(
    [
        getEpisodeProgress,
    ],
    (episodeProgress) => episodeProgress?.lastListenTime
);

export const getEpisodeIsComplete = createSelector(
    [
        getEpisodeProgress,
    ],
    (episodeProgress) => episodeProgress?.isComplete ?? false
);
