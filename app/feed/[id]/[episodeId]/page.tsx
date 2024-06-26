"use client";

import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/lib/redux/hooks";
import { getPodcast, getPodcastEpisode } from "@/lib/redux/selectors";
import { EpisodeDetail } from "@/app/components/EpisodeDetail";
import { EpisodeId, PodcastId } from "@/app/podcast";

const EpisodeDetailPage = (
    {
        params: {
            id,
            episodeId,
        },
    }: {
        params: {
            id: PodcastId;
            episodeId: EpisodeId;
        };
    }
) => {
    episodeId = decodeURIComponent(episodeId);
    const podcast = useAppSelector((state) => getPodcast(state, {id}));
    const episode = useAppSelector((state) => getPodcastEpisode(state, {id, episodeId}));

    if (!episode) {
        return (
            <Typography>
                Loading...
            </Typography>
        );
    }

    return (
        <EpisodeDetail
            episode={episode}
            podcast={podcast!}
        />
    );
};

export default EpisodeDetailPage;
