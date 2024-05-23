import { SearchResults } from "@/app/components/PodcastSearch";

const SearchPage = ({searchParams: {q: query}}: {searchParams: {q: string;};}) => {
    return (
        <SearchResults
            searchString={query}
        />
    );
};

export default SearchPage;
