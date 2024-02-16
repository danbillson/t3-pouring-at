import { LoadingBarPreview } from "~/components/loading";
import { SearchForm } from "~/components/search-form";

export default function SearchLoading() {
  return (
    <>
      <SearchForm loading />
      <div className="grid w-full grid-cols-1 gap-4 px-6 md:grid-cols-2">
        <LoadingBarPreview />
        <LoadingBarPreview />
      </div>
    </>
  );
}
