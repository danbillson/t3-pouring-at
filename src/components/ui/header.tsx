import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoggedInDropdown } from "~/components/logged-in-dropdown";
import { api } from "~/utils/api";
import { ModeToggle } from "~/components/mode-toggle";

export const Header = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data } = api.bars.getBySlug.useQuery({ slug }, { enabled: !!slug });

  return (
    <header className="container flex justify-between p-8">
      <Link href="/" className="text-l font-bold">
        Pouring at {data?.bar.name || "..."}
      </Link>
      <div className="flex items-center gap-1">
        {isSignedIn ? <LoggedInDropdown /> : <SignInButton />}
        <ModeToggle />
      </div>
    </header>
  );
};
