"use client";

import { useState } from "react";
import { Button } from "@heroui/button";

import { logout } from "@/app/actions/auth";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const performLogout = async () => {
    setIsLoading(true);
    await logout();
  };

  return (
    <Button
      color="warning"
      data-testid="logout-button"
      isLoading={isLoading}
      variant="flat"
      onPress={performLogout}
    >
      ESCI
    </Button>
  );
}
