"use client";

import { useEffect, useState } from "react";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
import RentModal from "./modals/RentModal";

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
      <RentModal />
    </>
  );
};

export default ModalProvider;
