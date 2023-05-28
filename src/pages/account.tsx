import { UserProfile } from "@clerk/nextjs";
import { type NextPage } from "next";

const Account: NextPage = () => {
  return (
    <main className="flex flex-col justify-center">
      <div className=" center container flex flex-col items-center gap-12 px-4 py-16 ">
        <UserProfile />
      </div>
    </main>
  );
};

export default Account;
