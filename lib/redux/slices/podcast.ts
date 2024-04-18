import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Podcast } from "@/app/podcast";


export interface PodcastSliceState {
    items: Podcast[];
}

const initialState: PodcastSliceState = {
    items: [],
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
        }
    },
});

export const {addPodcast} = podcastSlice.actions;

export const podcastReducer = podcastSlice.reducer;
