import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentlyPlayingEpisode, Playlist, PodcastEpisodeId } from "@/app/playlist";


export interface PlaylistSliceState {
    defaultPlaylist: Playlist;
    curentlyPlaying: CurrentlyPlayingEpisode|null;
}

const moveItem = (playlist: Playlist, from: number, to: number) => {
    const [item] = playlist.items.splice(from, 1);
    if (from < to) {
        // If the item we removed is before the target, the
        // removal decreases the index of the target by 1
        to -= 1;
    }
    playlist.items = [
        ...playlist.items.slice(0, to),
        item,
        ...playlist.items.slice(to),
    ];

    return playlist;
};

const initialState: PlaylistSliceState = {
    defaultPlaylist: {
        items: [],
    },
    curentlyPlaying: null,
};

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        addPlaylistItem(state, action: PayloadAction<{
            episodeId: PodcastEpisodeId;
            playlistId?: string;
        }>) {
            const {episodeId, playlistId} = action.payload;

            if (!playlistId) {
                state.defaultPlaylist.items.push(episodeId);
            }
        },

        removePlaylistItem(state, action: PayloadAction<{
            index: number;
            playlistId?: string;
        }>) {
            const {index, playlistId} = action.payload;

            if (!playlistId) {
                state.defaultPlaylist.items.splice(index, 1);
            }
        },

        movePlaylistItem(state, action: PayloadAction<{
            from: number;
            to: number;
            playlistId?: string;
        }>) {
            const {from, playlistId} = action.payload;
            let {to} = action.payload;

            if (!playlistId) {
                state.defaultPlaylist = moveItem(
                    state.defaultPlaylist,
                    from,
                    to
                );
            }
        },

        setCurrentlyPlaying(state, action: PayloadAction<CurrentlyPlayingEpisode|null>) {
            state.curentlyPlaying = action.payload === null ? null : {
                playlistId: action.payload.playlistId,
                podcastEpisodeId: action.payload.podcastEpisodeId,
            };
        },
    },
});

export const {
    addPlaylistItem,
    removePlaylistItem,
    movePlaylistItem,
    setCurrentlyPlaying,
} = playlistSlice.actions;

export const playlistReducer = playlistSlice.reducer;
