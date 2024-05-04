import * as React from "react";
import { Shell } from "../ui/Shell";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Shell variant={"container"}>
          <div
            className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
            
          "
          >
            <Logo />
            <Search />
            <UserMenu />
          </div>
        </Shell>
      </div>
    </div>
  );
};

export default Header;
