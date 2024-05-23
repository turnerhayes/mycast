"use client";

import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box"; 
import InputAdornment from "@mui/material/InputAdornment"; 
import TextField from "@mui/material/TextField"; 
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import SearchIcon from "@mui/icons-material/Search";
import {
    ReadonlyURLSearchParams,
    useRouter,
    useSearchParams,
    useSelectedLayoutSegment,
    useSelectedLayoutSegments,
} from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { getPodcast, getPodcastEpisode } from "@/lib/redux/selectors";


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

const getBreadcrumbItems = (
    layoutSegments: string[],
    state: RootState,
    searchParams: ReadonlyURLSearchParams
): BreadcrumbItem[] => {
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

        const podcast = getPodcast(state, {id: podcastId,});

        if (!podcast) {
            throw new Error(`No podcast with id ${podcastId}`);
        }
        const episode = episodeId ? getPodcastEpisode(state, {
            id: podcastId,
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

    if (layoutSegments[0] === "search") {
        return [
            {
                text: "Search",
                href: `/search?${searchParams}`
            }
        ];
    }

    return [];
};

export const AppHeader = () => {
    const [searchString, setSearchString] = useState("");

    const router = useRouter();
    const state = useAppStore().getState();
    const segments = useSelectedLayoutSegments();
    
    const searchParams = useSearchParams();
    const segment = useSelectedLayoutSegment();
    useEffect(() => {
        if (segment !== "search") {
            return;
        }
        const query = searchParams.get("q");
        if (query) {
            setSearchString(query);
        }
    }, [
        setSearchString,
        segment,
        searchParams,
    ]);

    const breadcrumbItems = getBreadcrumbItems(segments, state, searchParams);

    breadcrumbItems.unshift({
        text: "Home",
        href: "/",
    });

    const handleSearchSubmit = useCallback((event: FormEvent) => {
        event.preventDefault();
        router.push(`/search?q=${encodeURIComponent(searchString)}`);
    }, [
        searchString,
        router,
    ]);

    const handleSearchFieldChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    }, [
        setSearchString,
    ]);

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
                <Box
                    sx={{
                        marginLeft: "auto",
                    }}
                >
                    <form
                        action="/search"
                        onSubmit={handleSearchSubmit}
                    >
                        <TextField
                            size="small"
                            placeholder="Search podcasts"
                            name="q"
                            value={searchString}
                            onChange={handleSearchFieldChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </form>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
