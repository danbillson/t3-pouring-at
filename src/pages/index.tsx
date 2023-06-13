import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="max-w-2xl px-4 text-2xl text-black">
          Search for your favourite beers that are pouring at bars across the UK
        </h1>
      </div>
    </main>
  );
};

export default Home;
