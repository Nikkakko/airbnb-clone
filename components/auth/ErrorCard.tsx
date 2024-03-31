"use client";
import { useModalStore } from "@/store/modalStore";
import * as React from "react";
import { Button } from "../ui/button";

interface ErrorCardProps {}

const ErrorCard: React.FC<ErrorCardProps> = ({}) => {
  const { onOpen } = useModalStore();
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="bg-rose-600 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center">Error!</h1>
        <p className="text-lg text-center text-white">
          Email already in use with different provider!
        </p>
      </div>

      <Button
        className="mt-4 bg-rose-500 hover:bg-rose-600"
        onClick={() => onOpen("login", {})}
        size="lg"
      >
        Login
      </Button>
    </div>
  );
};

export default ErrorCard;
