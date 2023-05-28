import { UserProfile } from "@clerk/nextjs";
import { type NextPage } from "next";

const Account: NextPage = () => {
  return (
    <main className="flex flex-col items-center gap-12 px-4 py-16">
      <UserProfile />
    </main>
  );
};

export default Account;
