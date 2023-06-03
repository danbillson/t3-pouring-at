import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { LoggedInDropdown } from "~/components/logged-in-dropdown";

type HeaderProps = {
  barName?: string;
};

export const Header = ({ barName }: HeaderProps) => {
  const { isSignedIn } = useAuth();
  return (
    <header className="mx-auto flex max-w-6xl justify-between p-8">
      <Link href="/" className="text-xl font-bold">
        Pouring at {barName || "..."}
      </Link>
      {isSignedIn ? <LoggedInDropdown /> : <SignInButton />}
    </header>
  );
};
