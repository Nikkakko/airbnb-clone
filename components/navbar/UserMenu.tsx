"use client";
import * as React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import MenuItem from "./MenuItem";
import { useModalStore } from "@/store/modalStore";
import { logout } from "@/_actions/logout";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const loggedInItems = [
  {
    id: "1",
    label: "My trips",
    href: "/trips",
  },
  {
    id: "2",
    label: "My favorites",
    href: "/favorites",
  },

  {
    id: "4",
    label: "My properties",
    href: "/properties",
  },
];

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = ({}) => {
  const { type, onOpen } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleRent = React.useCallback(() => {
    if (!user) {
      onOpen("login", {});
    } else {
      onOpen("rent", {});
    }
  }, [user, onOpen]);

  const handleRedirect = React.useCallback(
    (href: string) => {
      router.push(href);
      setIsOpen(false);
    },
    [router]
  );
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2">
        <div
          onClick={handleRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb your home
        </div>

        <DropdownMenuTrigger className="">
          <div className="flex flex-row items-center gap-3">
            <div className="p-4 md:py-1 md:px-2 border-[1px]   border-neutral-200  flex  flex-row  items-center  gap-3  rounded-full  cursor-pointer  hover:shadow-md  transition">
              <AiOutlineMenu size={18} />
              <div className="hidden md:block">
                <Avatar>
                  <AvatarImage
                    src={user?.image as string}
                    alt={user?.name as string}
                  />
                  <AvatarFallback>
                    <Image
                      src={"/images/placeholder.jpg"}
                      alt={"user-avatar"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="end">
        <div className="flex flex-col cursor-pointer">
          {user ? (
            <>
              {loggedInItems.map(item => (
                <MenuItem
                  key={item.id}
                  onClick={() => handleRedirect(item.href)}
                  label={item.label}
                />
              ))}
              <MenuItem label="Airbnb your home" onClick={handleRent} />
              <Separator />
              <MenuItem
                label="Logout"
                onClick={() => {
                  startTransition(() => {
                    logout();
                  });
                  setIsOpen(false);
                }}
              />
            </>
          ) : (
            <>
              <MenuItem
                onClick={() => {
                  onOpen("login", {});
                  setIsOpen(false);
                }}
                label={"Login"}
              />
              <MenuItem
                onClick={() => {
                  onOpen("register", {});
                  setIsOpen(false);
                }}
                label={"Sign up"}
              />
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
