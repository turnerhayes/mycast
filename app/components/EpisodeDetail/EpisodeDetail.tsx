import { useRef } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AudioPlayer from "react-h5-audio-player";
import { Podcast, PodcastEpisode } from "@/app/podcast";
import { EpisodeImage } from "@/app/components/EpisodeImage";
import { Description } from "@/app/components/Description";

import 'react-h5-audio-player/lib/styles.css';

export const EpisodeDetail = (
    {
        episode,
        podcast,
    }: {
        episode: PodcastEpisode;
        podcast: Podcast;
    }
) => {
    const playerRef = useRef<H5AudioPlayer|null>(null);

    return (
        <Stack>
            <Stack
                component="header"
                direction="row"
                sx={{
                    padding: 1,
                }}
            >
                <EpisodeImage
                    episode={episode}
                />
                <Stack>
                    <Typography
                        variant="h4"
                    >
                        {podcast.title}
                    </Typography>
                    <Typography
                        variant="h3"
                    >
                        {episode.title}
                    </Typography>
                </Stack>
            </Stack>
            <Description>{
                episode.description ?? ""
            }</Description>
            <AudioPlayer
                ref={playerRef}
                header={
                    <>
                        {podcast.title} &mdash; {episode.title}
                    </>
                }
                src={episode.enclosure.url}
            ></AudioPlayer>
        </Stack>
    );
};
