import { SearchForm } from "~/components/search-form";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="max-w-2xl px-4 text-2xl">
          Search for your favourite beers that are pouring at bars across the UK
        </h1>
        <SearchForm />
      </div>
    </main>
  );
}
