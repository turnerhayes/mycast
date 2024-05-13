"use client";

import { gql, skipToken, useSuspenseQuery } from "@apollo/client";

export const dynamic = "force-dynamic";

export interface PodcastSearchResult {
    uuid: string;
    name: string;
    rssUrl: string;
    imageUrl: string;
}

interface PodcastSearchResults {
    searchForTerm: {
        searchId: string;
        podcastSeries: PodcastSearchResult[];
    };
};

export const useSearchPodcasts = (
    {
        searchString,
    }: {
        searchString: string;
    }
): PodcastSearchResults["searchForTerm"]["podcastSeries"]|null => {
    const hasSearch = Boolean(searchString.replace(/\s+/, ""));

    const query = gql`query {
        searchForTerm(
            term:"$searchString",
            filterForTypes:PODCASTSERIES,
        ){
            searchId
            podcastSeries{
                uuid
                name
                rssUrl
                imageUrl
            }
        }
      }`;

    const { data } = useSuspenseQuery<PodcastSearchResults>(query, hasSearch ? {
        variables: {
            searchString,
        }
    } : skipToken);
    if (hasSearch) {
        return data?.searchForTerm.podcastSeries ?? [];
    }

    return null;
};