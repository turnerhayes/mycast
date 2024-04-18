"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { Feed } from "@/app/components/Feed";
import { Typography } from "@mui/material";
import { getPodcast, getPodcasts } from "@/lib/redux/selectors";

const FeedPage = () => {
    const podcast = useAppSelector((state) => getPodcast(state, {id: 0}));

    if (!podcast) {
        return (<Typography>
            Loading...
        </Typography>);
    }

    return (
        <Feed
            podcast={podcast}
        />
    );
};

export default FeedPage;
