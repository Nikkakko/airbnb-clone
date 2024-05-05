"use client";
import { useModalStore } from "@/store/modalStore";
import * as React from "react";
import { Button } from "./ui/button";

interface LoginButtonProps {}

const LoginButton: React.FC<LoginButtonProps> = ({}) => {
  const { onOpen } = useModalStore();
  return <Button onClick={() => onOpen("login", {})}>Login</Button>;
};

export default LoginButton;
