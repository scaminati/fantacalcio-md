import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import Link from "next/link";
import { Button } from "@heroui/button";
import { HomeIcon } from "@heroicons/react/24/outline";

export const Navbar = () => {

  return (
    <HeroUINavbar disableAnimation isBordered>

      <NavbarContent className="gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">FANTAMD</p>
        </NavbarBrand>
        <NavbarItem>
            <NextLink color="foreground" href="/">
              <HomeIcon className="size-6" />
            </NextLink>
        </NavbarItem>
            
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <Button color="warning" href="#" variant="flat">LOGOUT</Button>
        </NavbarItem>
      </NavbarContent>

    </HeroUINavbar>
  );
};
