import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import React from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import { isAuthenticated } from "@/lib/session";
import LogoutButton from "@/app/login/compontents/logout-button";

export const Navbar = () => {
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();

      setIsAuth(result);
    };

    checkAuth();
  }, []);

  if (isAuth === null) return null;

  return (
    <HeroUINavbar disableAnimation isBordered>
      <NavbarContent className="gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit" data-testid="app-name">
            FANTAMD
          </p>
        </NavbarBrand>
        {isAuth && (
          <NavbarItem>
            {/*
            <NextLink color="foreground" href="/">
              <HomeIcon className="size-6" />
            </NextLink>
            */}
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        {isAuth && (
          <NavbarItem>
            <LogoutButton />
          </NavbarItem>
        )}
      </NavbarContent>
    </HeroUINavbar>
  );
};
