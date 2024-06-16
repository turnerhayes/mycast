import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";
import { EpisodeId, Podcast, PodcastEpisode, PodcastId } from "@/app/podcast";
import { PodcastEpisodeId } from "@/app/playlist";


/** Podcasts **/

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

export const getPodcastDict = createSelector(
    [
        getPodcasts,
    ],
    (podcasts) => podcasts.reduce(
        (dict, podcast) => {
            dict[podcast.id] = podcast;

            return dict;
        },
        {} as Record<PodcastId, Podcast>
    )
)

export const getPodcastEpisodes = createSelector(
    [
        getPodcastDict,
        (
            state: RootState,
            podcastEpisodeIds: PodcastEpisodeId[]
        ) => podcastEpisodeIds
    ],
    (podcastDict, podcastEpisodeIds) => podcastEpisodeIds.reduce(
        (dict, id) => {
            const podcast = podcastDict[id.podcastId];

            const episode = podcast.episodes.find((ep) => ep.id === id.episodeId);
            if (episode) {
                dict[JSON.stringify(id)] = {
                    podcast,
                    episode,
                };
            }

            return dict;
        },
        {} as Record<string, {
            podcast: Podcast;
            episode: PodcastEpisode;
        }>
    )
);

/** Playlists **/

export const getDefaultPlaylist = (state: RootState) => state.playlist.defaultPlaylist;

export const isInDefaultPlaylist = createSelector(
    [
        getDefaultPlaylist,
        (
            state: RootState,
            {
                podcastEpisodeId
            }: {
                podcastEpisodeId: PodcastEpisodeId;
            }
        ) => podcastEpisodeId,
    ],
    (playlist, podcastEpisodeId) => playlist.items.findIndex(
        (item) => item.podcastId === podcastEpisodeId.podcastId &&
            item.episodeId === podcastEpisodeId.episodeId
    ) >= 0
);
