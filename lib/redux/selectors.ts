import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";
import { EpisodeId, PodcastId } from "@/app/podcast";

export const getPodcasts = (state: RootState) => state.podcast.items;

export const getPodcast = createSelector(
    [
        getPodcasts,
        (state: RootState, params: {id: number;}) => params.id,
    ],
    (podcasts, id) => podcasts[id]
);

export const getPodcastEpisode = createSelector(
    [
        getPodcast,
        (state: RootState, params: {episodeId: string;}) => params.episodeId,
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
