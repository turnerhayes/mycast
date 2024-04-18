"use client";

import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/lib/redux/hooks";
import { Feed } from "@/app/components/Feed";
import { getPodcast, getPodcastEpisode } from "@/lib/redux/selectors";
import { EpisodeDetail } from "@/app/components/EpisodeDetail";

const EpisodeDetailPage = (
    {
        params: {
            id,
            episodeId,
        },
    }: {
        params: {
            id: number;
            episodeId: string;
        };
    }
) => {
    console.log("Podcast ID:", id);
    console.log("Episode ID:", episodeId)
    const podcast = useAppSelector((state) => getPodcast(state, {id}));
    const episode = useAppSelector((state) => getPodcastEpisode(state, {id, episodeId}));

    if (!episode) {
        return (<Typography>
            Loading...
        </Typography>);
    }

    return (
        <EpisodeDetail
            episode={episode}
            podcast={podcast}
        />
    );
};

export default EpisodeDetailPage;
