import { PodcastSearch } from "@/app/components/PodcastSearch/PodcastSearch";

const SearchPage = ({searchParams: {q: query}}: {searchParams: {q: string;};}) => {
    return (
        <PodcastSearch
            searchString={query || ""}
        />
    );
};

export default SearchPage;
