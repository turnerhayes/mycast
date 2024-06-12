"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export const PodcastSearchField = (
    props: TextFieldProps
) => {
    const [searchString, setSearchString] = useState("");

    const router = useRouter();
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

    const handleSearchFieldChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    }, [
        setSearchString,
    ]);

    const handleSearchSubmit = useCallback((event: FormEvent) => {
        event.preventDefault();
        router.push(`/search?q=${encodeURIComponent(searchString)}`);
    }, [
        searchString,
        router,
    ]);

    return (
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
                {...props}
            />
        </form>
    );
};
