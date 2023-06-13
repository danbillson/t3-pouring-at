import { type NextPage } from "next";
import { useRouter } from "next/router";
import { SearchForm } from "~/components/search-form";

type SearchQuery = {
  location: string;
  style: string | undefined;
  brewery: string | undefined;
};

const Search: NextPage = () => {
  const router = useRouter();
  const { location, style, brewery } = router.query as SearchQuery;
  const defaultValues = { location, style, brewery };

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="max-w-2xl px-4 text-2xl text-black">
          Search for your favourite beers that are pouring at bars across the UK
        </h1>
        <SearchForm defaultValues={defaultValues} />
      </div>
    </main>
  );
};

export default Search;
