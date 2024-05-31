"use client";

import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import {
    ReadonlyURLSearchParams,
    useRouter,
    useSearchParams,
    useSelectedLayoutSegment,
    useSelectedLayoutSegments,
} from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box"; 
import InputAdornment from "@mui/material/InputAdornment"; 
import TextField from "@mui/material/TextField"; 
import Typography from "@mui/material/Typography";
import { IconButton, SxProps, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppStore } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { getPodcast, getPodcastEpisode } from "@/lib/redux/selectors";
import { BaseLink } from "../Links";


const BreadcrumbLink = (
    {
        children,
        href,
        color,
        title,
        sx,
    }: {
        children: ReactNode;
        href: string;
        color: string;
        title?: string;
        sx?: SxProps;
    }
) => {
    return (
        <BaseLink
            href={href}
            color={color}
            variant="body2"
            title={title}
            sx={sx}
        >
            {children}
        </BaseLink>
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

    const sx: SxProps = {
        maxWidth: 200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    return (
        <Box>
            {
                isLast ? (
                    <Typography
                        variant="body1"
                        color={theme.palette.primary.contrastText}
                        title={item.text}
                        sx={sx}
                    >
                        {item.text}
                    </Typography>
                ) : (
                    <BreadcrumbLink
                        href={item.href}
                        color={theme.palette.primary.contrastText}
                        title={item.text}
                        sx={{
                            ...sx,
                            display: "inline-block",
                        }}
                    >
                        {item.text}
                    </BreadcrumbLink>
                )
            }
        </Box>
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
        const podcastId = decodeURIComponent(layoutSegments[1]);
        const episodeId = layoutSegments[2] ?
            decodeURIComponent(layoutSegments[2]) :
            undefined;

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

        console.log("layout segments:", layoutSegments);

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
            },
        ];
    }

    if (layoutSegments[0] === "downloads") {
        return [
            {
                text: "Downloads",
                href: "/downloads",
            },
        ];
    }

    return [];
};

export const AppHeader = (
    {
        onToggleMenu,
    }: {
        onToggleMenu: () => void;
    }
) => {
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
                <IconButton
                    onClick={onToggleMenu}
                >
                    <MenuIcon />
                </IconButton>
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
