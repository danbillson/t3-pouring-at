import { useAuth } from "@clerk/nextjs";
import { Edit, Home, LogOut, Menu, User2 } from "lucide-react";
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
          <Menu />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mx-2 w-56">
        <DropdownMenuItem onSelect={() => void router.push("/")}>
          <Home className="mr-2 h-4 w-4" />
          Home
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => void router.push("/account")}>
          <User2 className="mr-2 h-4 w-4" />
          Account
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => void router.push("/manage")}>
          <Edit className="mr-2 h-4 w-4" />
          Manage Bars
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
