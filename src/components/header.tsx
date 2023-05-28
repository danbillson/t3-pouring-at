import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { LoggedInDropdown } from "~/components/logged-in-dropdown";

export const Header = () => {
  const { isSignedIn } = useAuth();
  return (
    <header className="mx-auto flex max-w-4xl justify-between p-8">
      <Link href="/" className="text-xl font-bold">
        Fresh on Tap
      </Link>
      {isSignedIn ? <LoggedInDropdown /> : <SignInButton />}
    </header>
  );
};
