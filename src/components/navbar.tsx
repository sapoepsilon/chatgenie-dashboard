"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation"; // Updated import

export default function NavigationMenuDemo() {
  const { setTheme } = useTheme();
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();
  React.useEffect(() => {
    const supabase = createClient(); // Create a Supabase client instance

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={`${user ? "h-16 shadow-md px-6" : "hidden"}`}>
      <div className="container h-full flex justify-between w-full max-w-full">
        <NavigationMenu>
          <NavigationMenuList className="flex justify-end space-x-4">
            <NavigationMenuItem>
              <Link href="/" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Calls
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-end space-x-2">
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                className="bg-background text-foreground"
                variant="outline"
              >
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-background text-foreground"
              align="start"
            >
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/settings")}
              >
                Settings
              </Button>

              <form action="api/auth/signout" method="post">
                <Button variant="destructive" className="w-full" type="submit">
                  Sign out
                </Button>
              </form>
              {/* Create a button to navigate to the /settings routs */}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-background">
              <Button className="bg-background" variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all bg-background dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-background text-foreground"
            >
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
