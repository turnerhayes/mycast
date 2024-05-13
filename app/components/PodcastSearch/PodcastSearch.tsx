"use client";

import { ChangeEvent, useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
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


const SearchResultItem = (
    {
        result,
        onAdd,
        loading,
    }: {
        result: PodcastSearchResult;
        onAdd: (result: PodcastSearchResult) => void;
        loading: boolean;
    }
) => {
    const hasPodcast = useAppSelector(
        (state) => getPodcast(state, {id: result.uuid,})
    ) != null;
    const handleAddClick = useCallback(() => {
        onAdd(result);
    }, [
        onAdd,
        result,
    ]);

    return (
        <ListItem
            secondaryAction={
                hasPodcast ? (
                    <CheckIcon />
                ) : (
                    <LoadingButton
                        onClick={handleAddClick}
                        loading={loading}
                    >
                        <AddIcon />
                    </LoadingButton>
                )
            }
        >
            <ListItemAvatar>
                <img
                    src={result.imageUrl}
                    alt={`Image for "${result.name}" podcast`}
                    width={100}
                    height={100}
                />
            </ListItemAvatar>
            <ListItemText>
                {result.name}
            </ListItemText>
        </ListItem>
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

    const dispatch = useAppDispatch();

    const handleAddClick = useCallback(async (result: PodcastSearchResult) => {
        setAdding([
            ...adding,
            result.uuid,
        ]);
        const podcastWithoutId = await parseFeed(result.rssUrl);
        const podcast = {
            id: result.uuid,
            ...podcastWithoutId,
        };
        console.log("finished parsing podcast");
        // dispatch(addPodcast(podcast));
        setAdding(adding.filter((id) => id !== result.uuid));
    }, [
        dispatch,
        setAdding,
        adding,
    ]);

    return (
        <List>
            {
                results?.map((result) => (
                    <SearchResultItem
                        key={result.uuid}
                        result={result}
                        onAdd={handleAddClick}
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

    return (
        <Stack>
            <TextField
                label="Search for podcasts"
                onChange={handleSearchFieldChange}
                value={searchString}
            />
            {
                searchString ? (
                    <SearchResults
                        searchString={searchString}
                    />
                ) : null
            }
        </Stack>
    )
};
