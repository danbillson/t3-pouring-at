import { UserProfile } from "@clerk/nextjs";

export default function Account() {
  return (
    <main className="flex flex-col items-center gap-12 px-4 py-16">
      <UserProfile />
    </main>
  );
}
