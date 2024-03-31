"use client";

import { useEffect, useState } from "react";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <LoginModal />
      <RegisterModal />
    </>
  );
};

export default ModalProvider;
