"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { PodcastSearchResult, useSearchPodcasts } from "@/app/data/podcast_search";
import {parseFeed} from "@/app/podcast-parser";
import { addPodcast } from "@/lib/redux/slices/podcast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getPodcast } from "@/lib/redux/selectors";
import { Box, Collapse, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Description } from "@/app/components/Description";


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
        isExpanded,
        onToggleExpanded,
        loading,
    }: {
        result: PodcastSearchResult;
        onAdd: (result: PodcastSearchResult) => void;
        isExpanded: boolean;
        onToggleExpanded: (result: PodcastSearchResult) => void;
        loading: boolean;
    }
) => {
    const hasPodcast = useAppSelector(
        (state) => getPodcast(state, {id: result.rssUrl,})
    ) != null;
    const handleAddClick = useCallback(() => {
        onAdd(result);
    }, [
        onAdd,
        result,
    ]);

    const handleExpandButtonClick = useCallback(() => {
        onToggleExpanded(result);
    }, [
        onToggleExpanded,
        isExpanded,
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
                <img
                    src={result.imageUrl}
                    alt={`Image for "${result.name}" podcast`}
                    width={50}
                    height={50}
                />
            </ListItemAvatar>
            {/* <Accordion>
                <AccordionSummary>
                    {result.name}
                </AccordionSummary>
                <AccordionDetails>
                    <SearchResultItemDetails
                        result={result}
                    />
                </AccordionDetails>
            </Accordion> */}
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
                        <CheckIcon
                            color="success"
                            sx={{
                                marginRight: 2.5,
                            }}
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
            {/* <ListItemText
                secondary={
                    <SearchResultItemDetails
                        result={result}
                    />
                }
            >
                {result.name}
            </ListItemText> */}
        </ListItemButton>
    );
};

const SearchResults = (
    {
        searchString,
    }: {
        searchString: string;
    }
) => {
    const results = useSearchPodcasts({
        searchString,
    });

    console.log("results:", results);

    const [adding, setAdding] = useState<string[]>([]);
    const [expandedResult, setExpandedResult] = useState<PodcastSearchResult|null>(null);

    const dispatch = useAppDispatch();


    const handleAddClick = useCallback(async (result: PodcastSearchResult) => {
        setAdding([
            ...adding,
            result.uuid,
        ]);
        const podcastWithoutId = await parseFeed(result.rssUrl);
        const podcast = {
            id: result.rssUrl,
            ...podcastWithoutId,
        };
        console.log("finished parsing podcast");
        dispatch(addPodcast(podcast));
        setAdding(adding.filter((id) => id !== result.uuid));
    }, [
        dispatch,
        setAdding,
        adding,
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
                        isExpanded={expandedResult?.rssUrl === result.rssUrl}
                        onToggleExpanded={handleToggleResultExpanded}
                        loading={adding.includes(result.uuid)}
                    />
                ))
            }
        </List>
    );
};

export const PodcastSearch = () => {
    const [searchString, setSearchString] = useState("");
    const handleSearchFieldChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    }, [
        setSearchString,
    ]);

    // DEBUG
    useEffect(() => {
        handleSearchFieldChange({target: {value: "wait"}} as ChangeEvent<HTMLInputElement>);
    }, []);
    // END DEBUG

    return (
        <Stack
            sx={{
                height: "100%",
            }}
        >
            <TextField
                label="Search for podcasts"
                onChange={handleSearchFieldChange}
                value={searchString}
                margin="dense"
            />
            {
                searchString ? (
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                        }}
                    >
                        <SearchResults
                            searchString={searchString}
                        />
                    </Box>
                ) : null
            }
        </Stack>
    )
};
