"use client";

import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/lib/redux/hooks";
import { Feed } from "@/app/components/Feed";
import { getPodcast } from "@/lib/redux/selectors";

const FeedPage = (
    {
        params: {
            id
        },
    }: {
        params: {
            id: number;
        };
    }
) => {
    const podcast = useAppSelector((state) => getPodcast(state, {id}));

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
