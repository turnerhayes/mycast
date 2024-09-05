import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentlyPlayingEpisode, DEFAULT_PLAYLIST_ID, Playlist, PlaylistId, PodcastEpisodeId } from "@/app/playlist.d";


export interface PlaylistSliceState {
    defaultPlaylist: Playlist;
    curentlyPlaying: CurrentlyPlayingEpisode|null;
}

type PlaylistIndexOrEpisodeId = {
    playlistId?: string;
} & (
    {
        index: number;
        id?: never;
    } | {
        index?: never;
        id: PodcastEpisodeId;
    }
);

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

const _removePlaylistItem = ({
    state,
    playlistId,
    index,
}: {
    state: PlaylistSliceState;
    playlistId: string;
    index: number;
}) => {
    const playlist = playlistId ?
        state.defaultPlaylist : // TODO: handle non-default playlist
        state.defaultPlaylist;

    if (!playlistId) {
        playlist.items.splice(index, 1);
    }
};

const _setCurrentlyPlaying = (
    {
        state,
        currentlyPlaying,
    }: {
        state: PlaylistSliceState;
        currentlyPlaying: CurrentlyPlayingEpisode|null;
    }
) => {
    state.curentlyPlaying = currentlyPlaying;
};

const _addPlaylistItem = (
    {
        state,
        playlistId,
        episodeId,
    }: {
        state: PlaylistSliceState;
        playlistId: PlaylistId;
        episodeId: PodcastEpisodeId;
    }
) => {
    if (playlistId === DEFAULT_PLAYLIST_ID) {
        state.defaultPlaylist.items.push(episodeId);
        return state.defaultPlaylist.items.length - 1;
    }

    // TODO: support non-default playlists
    return 0;
};

const getIndex = (
    {
        playlist,
        index,
        id,
    }: {
        playlist: Playlist;
    } & (
        {
            index: number;
            id?: never;
        } | {
            index?: never;
            id: PodcastEpisodeId;
        }
    )
) => {
    if (index !== undefined) {
        return index;
    }

    return playlist.items.findIndex(
        (item) => item.episodeId === id!.episodeId &&
            item.podcastId === id!.podcastId
    );
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
            const {
                episodeId,
                playlistId = DEFAULT_PLAYLIST_ID,
            } = action.payload;

            _addPlaylistItem({
                state,
                episodeId,
                playlistId,
            });
        },

        addAndPlayItem(state, action: PayloadAction<{
            episodeId: PodcastEpisodeId;
            playlistId: PlaylistId;
        }>) {
            const {episodeId, playlistId} = action.payload;

            const index = _addPlaylistItem({
                state,
                playlistId,
                episodeId,
            });

            _setCurrentlyPlaying({
                state,
                currentlyPlaying: {
                    playlistId,
                    index,
                },
            });
        },

        removePlaylistItem(state, action: PayloadAction<PlaylistIndexOrEpisodeId>) {
            const {playlistId, ...indexOrId} = action.payload;

            const playlist = playlistId ?
                state.defaultPlaylist : // TODO: handle non-default playlist
                state.defaultPlaylist;

            const index = getIndex({
                playlist,
                ...indexOrId,
            });

            if (index < 0) {
                throw new Error(`Playlist item not found: ${indexOrId}`);
            }

            if (!playlistId) {
                playlist.items.splice(index, 1);
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
            _setCurrentlyPlaying({
                state,
                currentlyPlaying: action.payload,
            });
        },

        completePlaylistItem(state, action: PayloadAction<{
            playlistId: string;
            index: number;
        }>) {
            const { playlistId, index } = action.payload;

            const playlist = playlistId ?
                state.defaultPlaylist : // TODO: handle non-default playlists
                state.defaultPlaylist;

            const nextIndex = index < playlist.items.length - 1 ?
                index + 1 :
                null;
            
            _removePlaylistItem({
                state,
                playlistId,
                index,
            });

            _setCurrentlyPlaying({
                state,
                currentlyPlaying: nextIndex ? {
                    playlistId,
                    index: nextIndex,
                } : null,
            });
        },
    },
});

export const {
    addPlaylistItem,
    removePlaylistItem,
    movePlaylistItem,
    setCurrentlyPlaying,
    completePlaylistItem,
    addAndPlayItem,
} = playlistSlice.actions;

export const playlistReducer = playlistSlice.reducer;
