"use client";

import { ReactNode } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import { useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { getPodcast, getPodcastEpisode } from "@/lib/redux/selectors";
import { Typography, useTheme } from "@mui/material";


const BreadcrumbLink = (
    {
        children,
        href,
        color,
    }: {
        children: ReactNode;
        href: string;
        color: string;
    }
) => {
    return (
        <MuiLink
            component={Link}
            href={href}
            color={color}
            variant="body2"
        >
            {children}
        </MuiLink>
    );
};

interface BreadcrumbItem {
    text: string;
    href: string;
}

const BreadcrumbComponent = (
    {
        item,
        isLast,
    }: {
        item: BreadcrumbItem;
        isLast: boolean;
    }
) => {
    const theme = useTheme();

    return (
        isLast ? (
            <Typography
                variant="body1"
                color={theme.palette.primary.contrastText}
            >
                {item.text}
            </Typography>
        ) : (
            <BreadcrumbLink
                href={item.href}
                color={theme.palette.primary.contrastText}
            >
                {item.text}
            </BreadcrumbLink>
        )
    );
};

const getBreadcrumbItems = (layoutSegments: string[], state: RootState): BreadcrumbItem[] => {
    if (layoutSegments[0] === "feed") {
        if (layoutSegments[1] === "xml") {
            return [
                {
                    text: "XML sample",
                    href: "/feed/xml",
                },
            ];
        }
        const [_, podcastId, episodeId] = layoutSegments;

        const podcast = getPodcast(state, {id: Number(podcastId),});
        const episode = episodeId ? getPodcastEpisode(state, {
            id: Number(podcastId),
            episodeId,
        }) : undefined;

        const items = [
            {
                text: podcast.title,
                href: `/feed/${podcastId}`,
            },
        ];

        if (episode) {
            items.push(
                {
                    text: episode.title,
                    href: `/feed/${podcastId}/${episodeId}`,
                },
            );
        }

        return items;
    }

    return [];
};

export const AppHeader = () => {
    const state = useAppStore().getState();
    const segments = useSelectedLayoutSegments();

    const breadcrumbItems = getBreadcrumbItems(segments, state);

    breadcrumbItems.unshift({
        text: "Home",
        href: "/",
    });

    return (
        <AppBar
            position="static"
        >
            <Toolbar
                variant="dense"
            >
                <PodcastsIcon />
                <Breadcrumbs>
                    {
                        breadcrumbItems.map(
                            (item, index) => (
                                <BreadcrumbComponent
                                    key={index}
                                    item={item}
                                    isLast={
                                        index == breadcrumbItems.length - 1
                                    }
                                />
                            )
                        )
                    }
                </Breadcrumbs>
            </Toolbar>
        </AppBar>
    );
};
