"use client";

import { useEffect, useState } from "react";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
import RentModal from "./modals/RentModal";
import AddReviewModal from "./modals/AddReview";
import CommandModal from "./modals/CommandModal";

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
      <AddReviewModal />
      <CommandModal />
    </>
  );
};

export default ModalProvider;
