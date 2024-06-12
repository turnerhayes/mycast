import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PodcastId } from "@/app/podcast";


export type Playlist = PodcastId[];

export interface PlaylistSliceState {
    defaultPlaylist: Playlist;
}

const initialState: PlaylistSliceState = {
    defaultPlaylist: [],
};

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        addToPlaylist(state, action: PayloadAction<{
            podcastId: PodcastId;
            playlistId?: string;
        }>) {
            const {podcastId, playlistId} = action.payload;

            if (!playlistId) {
                state.defaultPlaylist.push(podcastId);
            }
        }
    },
});

export const {addToPlaylist,} = playlistSlice.actions;

export const playlistReducer = playlistSlice.reducer;
