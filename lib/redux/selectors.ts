import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";

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
