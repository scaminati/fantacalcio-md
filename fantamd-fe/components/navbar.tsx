import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@heroui/button";
import { HomeIcon } from "@heroicons/react/24/outline";
import { isAuthenticated } from "@/lib/session";

export const Navbar = async () => {
  const isAuth = await isAuthenticated();

  return (
    <HeroUINavbar disableAnimation isBordered>

      <NavbarContent className="gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">FANTAMD</p>
        </NavbarBrand>
        {isAuth && 
          <NavbarItem>
              <NextLink color="foreground" href="/">
                <HomeIcon className="size-6" />
              </NextLink>
          </NavbarItem>
        }
            
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        {isAuth && 
          <NavbarItem>
            <Button color="warning" href="#" variant="flat">LOGOUT</Button>
          </NavbarItem>
        } 
      </NavbarContent>

    </HeroUINavbar>
  );
};
