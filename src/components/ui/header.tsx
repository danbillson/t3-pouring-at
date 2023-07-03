import { useAuth } from "@clerk/nextjs";
import { Beer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoggedInDropdown } from "~/components/logged-in-dropdown";
import { ModeToggle } from "~/components/mode-toggle";
import { api } from "~/utils/api";

export const Header = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data } = api.bars.getBySlug.useQuery({ slug }, { enabled: !!slug });

  return (
    <header className="container flex justify-between p-8">
      <div className="flex items-center gap-6 text-muted-foreground">
        <div>
          <Link
            href="/"
            className="text-l mr-2 hidden font-bold text-foreground sm:inline-block"
          >
            Pouring at {data?.bar.name || "..."}
          </Link>
          <Link href="/" className="font-bold text-foreground sm:hidden">
            <Beer className="mr-2 inline-block" />
          </Link>
        </div>
        {isSignedIn ? (
          <Link href="/manage" className="text-sm">
            Manage
          </Link>
        ) : (
          <Link href="/business" className="text-sm">
            Business
          </Link>
        )}
      </div>
      <div className="flex items-center gap-1">
        {isSignedIn && <LoggedInDropdown />}
        <ModeToggle />
      </div>
    </header>
  );
};
