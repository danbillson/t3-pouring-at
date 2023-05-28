import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ExitIcon,
  HamburgerMenuIcon,
  PersonIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

export const LoggedInDropdown = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex h-[35px] w-[35px] items-center justify-center outline-none"
          aria-label="Signed in dropdown menu"
        >
          <HamburgerMenuIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade">
          <DropdownMenu.Item
            onSelect={() => void router.push("/account")}
            className={dropdownItem}
          >
            <PersonIcon className="mr-2 h-4 w-4" />
            Account
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => void router.push("/manage")}
            className={dropdownItem}
          >
            <Pencil2Icon className="mr-2 h-4 w-4" />
            Manage Bars
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="m-[5px] h-[1px] bg-orange6" />

          <DropdownMenu.Item
            onSelect={() => void signOut()}
            className={dropdownItem}
          >
            <ExitIcon className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const dropdownItem =
  "group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none text-orange11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-orange9 data-[disabled]:text-sand8 data-[highlighted]:text-orange1";
