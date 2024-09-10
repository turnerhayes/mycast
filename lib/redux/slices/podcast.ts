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

        removePodcast(state, {payload}: PayloadAction<{
            feedUrl: string;
        }>) {
            const i = state.items.findIndex((podcast) => payload.feedUrl === podcast.feedUrl);
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

        updatePodcasts(state, {payload}: PayloadAction<Podcast[]>) {
            for (const podcast of payload) {
                const index = state.items.findIndex((p) => p.feedUrl === podcast.feedUrl);
                if (index < 0) {
                    throw new Error(
                        `Unable to update podcast; podcast not currently added (feed URL: ${
                            podcast.feedUrl
                        })`
                    );
                }
                else {
                    state.items[index] = podcast;
                }
            }
        }
    },
});

export const {
    addPodcast,
    removePodcast,
    setEpisodeProgress,
    updatePodcasts,
} = podcastSlice.actions;

export const podcastReducer = podcastSlice.reducer;
