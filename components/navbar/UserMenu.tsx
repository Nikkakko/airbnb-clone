"use client";
import * as React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import MenuItem from "./MenuItem";
import { useModalStore } from "@/store/modalStore";

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = ({}) => {
  const { type, onOpen } = useModalStore();

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => {}}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb your home
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px]   border-neutral-200  flex  flex-row  items-center  gap-3  rounded-full  cursor-pointer  hover:shadow-md  transition"
        >
          <AiOutlineMenu size={18} />
          <div className="hidden md:block">
            <Avatar>
              <AvatarImage />
              <AvatarFallback />
            </Avatar>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-mdw-[40vw] md:w-3/4  bg-white overflow-hidden right-0 top-16 text-sm">
          <div className="flex flex-col cursor-pointer">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
