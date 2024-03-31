"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push("/")}
      className="hidden md:block cursor-pointer w-auto h-auto"
      src="/images/logo.png"
      height={100}
      width={100}
      alt="Logo"
      priority
    />
  );
};

export default Logo;
