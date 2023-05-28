import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <p className="text-2xl text-black">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
      </div>
    </main>
  );
};

export default Home;
