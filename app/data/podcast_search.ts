"use client";

import { SkipToken, SuspenseQueryHookOptions, gql, skipToken, useSuspenseQuery } from "@apollo/client";

export const dynamic = "force-dynamic";

export interface PodcastSearchResult {
    __typename: "PodcastSeries";
    uuid: string;
    name: string;
    description: string;
    rssUrl: string;
    imageUrl: string;
    totalEpisodesCount: number;
}

interface PodcastSearchResults {
    searchForTerm: {
        __typename: "SearchResults";
        searchId: string;
        podcastSeries: PodcastSearchResult[];
    };
};

const USE_DUMMY = true;

export const useSearchPodcasts = (
    {
        searchString,
    }: {
        searchString: string;
    }
): PodcastSearchResults["searchForTerm"]["podcastSeries"]|null => {
    const hasSearch = Boolean(searchString.replace(/\s+/, ""));
    let data: PodcastSearchResults|undefined;
    const query = gql`query SearchForTerm($searchString: String!) {
        searchForTerm(
            term: $searchString ,
            filterForTypes: PODCASTSERIES,
            searchResultsBoostType: BOOST_POPULARITY_A_LOT,
        ){
            searchId
            podcastSeries{
                uuid
                name
                description
                rssUrl
                imageUrl
                totalEpisodesCount
            }
        }
        }`;

    let args: SuspenseQueryHookOptions|SkipToken = skipToken;
    if (hasSearch && !USE_DUMMY) {
        args = {
            variables: {
                searchString,
            },
        };
    }

    const queryResult = useSuspenseQuery<PodcastSearchResults>(query, args);

    if (USE_DUMMY) {
        data = DUMMY_SEARCH_RESULTS;
    }
    else {
        data = queryResult.data;
    }
    if (hasSearch) {
        return data?.searchForTerm.podcastSeries ?? [];
    }

    return null;
};

const DUMMY_SEARCH_RESULTS: PodcastSearchResults = {
    "searchForTerm": {
        "__typename": "SearchResults",
        "searchId": "994ba08b43091d5dec14630adfaedd40bbdd832c633254f0aadb1ad43fde3ef9",
        "podcastSeries": [
            {
                "__typename": "PodcastSeries",
                "uuid": "a56da4ac-139f-461e-9066-46b8cda8f2b5",
                "name": "Wait Wait... Don't Tell Me!",
                "description": "NPR's weekly news quiz hosted by Peter Sagal. Have a laugh and test your knowledge with today's funniest comedians and a celebrity guest.<em data-stringify-type=\"italic\"><br><br></em><em data-stringify-type=\"italic\">Hate free content? Try a subscription to Wait Wait... Don't Tell Me!+. Your subscription supports public radio and unlocks fun bonus episodes along with sponsor-free listening. Learn more at </em><em data-stringify-type=\"italic\">https://plus.npr.org/waitwait</em>",
                "rssUrl": "https://feeds.npr.org/344098539/podcast.xml",
                "imageUrl": "https://media.npr.org/assets/img/2022/09/23/waitwait-don-t-tell-me_tile_npr-network-01_sq-d51413832c7ccf5301741d7f1ee2e1853fed9597.jpg?s=1400&c=66&f=jpg",
                "totalEpisodesCount": 300
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "feb7f19b-22b5-486f-99a1-f78c9bddf3d9",
                "name": "The Wait For It Podcast",
                "description": "<p>Hosted by MrEricAlmighty and PhilTheFilipino, the guys discuss all things in Pop Culture from movies, gaming, anime and anything in between. New episodes every Wednesday, all you have to do is...WAIT FOR IT!</p>",
                "rssUrl": "https://feeds.buzzsprout.com/930421.rss",
                "imageUrl": "https://storage.buzzsprout.com/cunfqxt22v41lf4tqqlhjwqnsl0o?.jpg",
                "totalEpisodesCount": 375
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "48dfd3fa-a12b-4982-a373-028e5a8b6ec3",
                "name": "Live Wire with Luke Burbank",
                "description": "<p>Like late-night for radio, Live Wire is hosted by Luke Burbank (Wait Wait Don’t Tell Me) and artfully blends an eclectic mix of artists, musicians, writers, filmmakers, comedians, and cultural observers. </p>",
                "rssUrl": "https://feed.livewireradio.org/",
                "imageUrl": "https://f.prxu.org/330/images/34f2ed73-c025-447e-b682-d9c9128b64c0/LiveWirePodcastCover_2000x2000_copy.png",
                "totalEpisodesCount": 633
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "1be82094-f6f3-42e5-8df8-79de2f37b8f3",
                "name": "I'd Buy That For A Dollar",
                "description": "A podcast about inexpensive, common and underappreciated records that are waiting to be rediscovered.",
                "rssUrl": "https://feed.podbean.com/idbuythat/feed.xml",
                "imageUrl": "https://pbcdn1.podbean.com/imglogo/image-logo/6118607/idbuythatLOGO.jpg",
                "totalEpisodesCount": 248
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "74ef2e8d-bcaa-42ed-8a3e-9301f130d166",
                "name": "A Date With The Bake",
                "description": "On your mark, get set...Wait, is my oven on?",
                "rssUrl": "https://adatewiththebake.blubrry.net/feed/podcast/",
                "imageUrl": "https://adatewiththebake.blubrry.net/wp-content/uploads/powerpress/ADatewithBake1.jpg",
                "totalEpisodesCount": 53
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "7e6352ce-8aff-48a1-8ec3-373973b8a8ca",
                "name": "Wait For It",
                "description": "Le podcast qui aime regarder les séries TV, et penser avec elles. Pour nous soutenir, retrouvez-nous sur Patreon : https://www.patreon.com/ZQSD !",
                "rssUrl": "http://zqsd.fr/wfi.xml",
                "imageUrl": "http://zqsd.fr/audio/WFI_logo_1400x1400.jpg",
                "totalEpisodesCount": 26
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "89a2710d-e50b-4edb-8ddc-2a3e93a94a11",
                "name": "Cyclops is Waiting for Me - An X-Men: The Animated Series Weekly Recap",
                "description": "Cyclops is Waiting for Me is our weekly podcast series where we are going back and watching EVERY-SINGLE-EPISODE of the original 1992 X-Men: The Animated Series in their original intended script order building up to the release of X-Men 97’, originally coming in 2023. \nIn the mean time, we'll be covering all other X-Men animated episodes.\nThis is a recap show so there will be spoilers. \n\nTheme Music by Ron Wasserman (ASCAP) &amp; Rod Kim (ASCAP)",
                "rssUrl": "https://anchor.fm/s/7bded0c0/podcast/rss",
                "imageUrl": "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/20682000/20682000-1642788796881-543e180f7b2a4.jpg",
                "totalEpisodesCount": 123
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "293b6189-35d1-4d1c-a755-fbdd31075ab1",
                "name": "D&D Minus",
                "description": "The actual play podcast with all the swearing and dick jokes you've been waiting for",
                "rssUrl": "https://danddminus.libsyn.com/rss",
                "imageUrl": "https://static.libsyn.com/p/assets/4/4/7/7/4477e3191e40db1fe5bbc093207a2619/Season_2_Logo.jpg",
                "totalEpisodesCount": 65
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "bf31d937-b6e4-444e-9751-7c90dc8dd25b",
                "name": "Worth Thee Wait",
                "description": "Worth Thee Wait is an audio/visual podcast hosted by power couple Dre Smith & Breanna Aponte (Smith). In this podcast, the couple pulls from their personal relationship experiences to give practical advice on preparing for your forever person, identifying your forever person, and maintaining that relationship to ensure that it is happy and healthy. Dre and Bre waited for 3.5 years to have sex until marriage, and now, being happily married, they are excited to give others their perspective to help them find someone worth waiting for! Tune in Every Wednesday @ 6:30 AM!",
                "rssUrl": "https://www.spreaker.com/show/5509678/episodes/feed",
                "imageUrl": "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/e7989d5d28837a79c9ca1282442cfcd6.jpg",
                "totalEpisodesCount": 23
            },
            {
                "__typename": "PodcastSeries",
                "uuid": "f2710373-0707-4327-adff-f0fe43c8c25a",
                "name": "RAIN DAWGZ",
                "description": "A podcast sort of about Tom Waits",
                "rssUrl": "https://audioboom.com/channels/5074865.rss",
                "imageUrl": "https://audioboom.com/i/39063495/s=1400x1400/el=1/rt=fill.png",
                "totalEpisodesCount": 2
            }
        ]
    }
};
