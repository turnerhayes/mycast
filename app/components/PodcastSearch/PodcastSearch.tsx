"use client";

import { MouseEvent, useCallback, useState } from "react";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/RemoveCircle";
import CheckIcon from "@mui/icons-material/Check";
import { PodcastSearchResult, useSearchPodcasts } from "@/app/data/podcast_search";
import { parseFeed } from "@/app/podcast-parser";
import { addPodcast, removePodcast } from "@/lib/redux/slices/podcast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getPodcastByFeedUrl } from "@/lib/redux/selectors";
import { Description } from "@/app/components/Description";
import { ChangeOnHover } from "@/app/components/ChangeOnHover";
import { PodcastSearchField } from "@/app/components/PodcastSearch/PodcastSearchField";
import Image from "next/image";


const ExistingPodcastIcon = (
    {
        result,
        onRemove,
    }: {
        result: PodcastSearchResult;
        onRemove: (result: PodcastSearchResult) => void;
    }
) => {
    const handleRemoveClick = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        onRemove(result);
    }, [
        result,
        onRemove,
    ]);

    return (
        <ChangeOnHover
        >
            <CheckIcon
                color="success"
                sx={{
                    marginRight: 2.5,
                }}
            />
            <IconButton
                className="hovered"
                onClick={handleRemoveClick}
                sx={{
                    marginRight: 1.5,
                }}
            >
                <RemoveIcon
                    color="error"
                />
            </IconButton>
        </ChangeOnHover>
    );
};

const SearchResultItemDetails = (
    {
        result,
    }: {
        result: PodcastSearchResult;
    }
) => {
    return (
        <Stack>
            <Typography
                variant="caption"
            >
                {result.totalEpisodesCount} episodes
            </Typography>
            <Description
                typographyProps={{
                    variant: "body2",
                }}
            >
                {result.description}
            </Description>
        </Stack>
    )
};

const SearchResultItem = (
    {
        result,
        onAdd,
        onRemove,
        isExpanded,
        onToggleExpanded,
        loading,
    }: {
        result: PodcastSearchResult;
        onAdd: (result: PodcastSearchResult) => void;
        onRemove: (result: PodcastSearchResult) => void;
        isExpanded: boolean;
        onToggleExpanded: (result: PodcastSearchResult) => void;
        loading: boolean;
    }
) => {
    const hasPodcast = useAppSelector(
        (state) => getPodcastByFeedUrl(state, {url: result.rssUrl,})
    ) != null;
    const handleAddClick = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        onAdd(result);
    }, [
        onAdd,
        result,
    ]);

    const handleExpandButtonClick = useCallback(() => {
        onToggleExpanded(result);
    }, [
        onToggleExpanded,
        result,
    ]);

    return (
        <ListItemButton
            onClick={handleExpandButtonClick}
            selected={isExpanded}
        >
            <ListItemAvatar
                sx={{
                    alignSelf: "start",
                }}
            >
                <Image
                    src={result.imageUrl}
                    alt={`Image for "${result.name}" podcast`}
                    width={50}
                    height={50}
                />
            </ListItemAvatar>
            <ListItemText>
                {result.name}
                <Collapse
                    in={isExpanded}
                >
                    <SearchResultItemDetails
                        result={result}
                    />
                </Collapse>
            </ListItemText>
            <Box
                sx={{
                    alignSelf: "start",
                }}
            >
                {
                    hasPodcast ? (
                        <ExistingPodcastIcon
                            result={result}
                            onRemove={onRemove}
                        />
                    ) : (
                        <LoadingButton
                            onClick={handleAddClick}
                            loading={loading}
                        >
                            <AddIcon />
                        </LoadingButton>
                    )
                }
            </Box>
        </ListItemButton>
    );
};

export const SearchResults = (
    {
        searchString,
    }: {
        searchString: string;
    }
) => {
    const results = useSearchPodcasts({
        searchString,
    });

    const [processing, setProcessing] = useState<string[]>([]);
    const [expandedResult, setExpandedResult] = useState<PodcastSearchResult|null>(null);

    const dispatch = useAppDispatch();

    const handleAddClick = useCallback(async (result: PodcastSearchResult) => {
        setProcessing([
            ...processing,
            result.uuid,
        ]);
        const podcastWithoutId = await parseFeed(result.rssUrl);
        const podcast = {
            id: result.uuid,
            ...podcastWithoutId,
        };
        console.log("finished parsing podcast");
        dispatch(addPodcast(podcast));
        setProcessing(processing.filter((id) => id !== result.uuid));
    }, [
        dispatch,
        setProcessing,
        processing,
    ]);

    const handleRemoveClick = useCallback((result: PodcastSearchResult) => {
        dispatch(removePodcast({
            feedUrl: result.rssUrl,
        }));
    }, [
        dispatch,
    ]);

    const handleToggleResultExpanded = useCallback((result: PodcastSearchResult) => {
        setExpandedResult(expandedResult?.rssUrl === result.rssUrl ? null : result);
    }, [
        setExpandedResult,
        expandedResult,
    ]);

    return (
        <List>
            {
                results?.map((result) => (
                    <SearchResultItem
                        key={result.uuid}
                        result={result}
                        onAdd={handleAddClick}
                        onRemove={handleRemoveClick}
                        isExpanded={expandedResult?.rssUrl === result.rssUrl}
                        onToggleExpanded={handleToggleResultExpanded}
                        loading={processing.includes(result.uuid)}
                    />
                ))
            }
        </List>
    );
};

export const PodcastSearch = (
    {
        searchString,
    }: {
        searchString: string;
    }
) => {
    return (
        <Stack>
            <PodcastSearchField
                fullWidth
            />
            <SearchResults
                searchString={searchString}
            />
        </Stack>
    );
};
