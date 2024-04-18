import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EpisodeId, Podcast, PodcastId, PodcastProgress } from "@/app/podcast";


export interface PodcastSliceState {
    items: Podcast[];
    podcastProgress: PodcastProgress;
}

const initialState: PodcastSliceState = {
    items: [],
    podcastProgress: {},
};

const podcastSlice = createSlice({
    name: "podcasts",
    initialState,
    reducers: {
        addPodcast(state, {payload}: PayloadAction<Podcast>) {
            state.items.push(payload);
        },

        removePodcast(state, {payload}: PayloadAction<Podcast>) {
            const i = state.items.findIndex((podcast) => payload.url === podcast.url);
            if (i >= 0) {
                state.items.splice(i, 1);
            }
        },

        setEpisodeProgress(state, {payload}: PayloadAction<{
            podcastId: PodcastId;
            episodeId: EpisodeId;
            lastListenTime: number;
        }>) {
            const {podcastId, episodeId, lastListenTime} = payload;

            if (!state.podcastProgress[podcastId]) {
                state.podcastProgress[podcastId] = {
                    episodes: {
                    },
                };
            }

            if (!state.podcastProgress[podcastId].episodes[episodeId]) {
                state.podcastProgress[podcastId].episodes[episodeId] = {
                    lastListenTime: 0,
                    isComplete: false,
                };
            }

            state.podcastProgress[podcastId].episodes[episodeId]
                .lastListenTime = lastListenTime;
        },
    },
});

export const {addPodcast, removePodcast, setEpisodeProgress} = podcastSlice.actions;

export const podcastReducer = podcastSlice.reducer;
