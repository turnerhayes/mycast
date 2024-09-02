import { CurrentlyPlayingEpisode } from "@/app/playlist";
import { Typography } from "@mui/material";

export const Player = (
    {
        currentEpisode,
    }:
    {
        currentEpisode: CurrentlyPlayingEpisode;
    }
) => {
    return (
        <>
        <Typography>
            PLAYER
        </Typography>
        </>
    );
};
