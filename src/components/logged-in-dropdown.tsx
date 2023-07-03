import { useAuth } from "@clerk/nextjs";
import { LogOut, User2 } from "lucide-react";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const LoggedInDropdown = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-[35px] w-[35px] items-center justify-center outline-none"
          aria-label="Signed in dropdown menu"
        >
          <User2 />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mx-2 w-56">
        <DropdownMenuItem onSelect={() => void router.push("/account")}>
          <User2 className="mr-2 h-4 w-4" />
          Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => void signOut(() => router.push("/"))}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
