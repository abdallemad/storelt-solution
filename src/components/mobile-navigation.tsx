"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { handleLogout } from "@/lib/actions/user.action";
import { navItems } from "@/lib/constance";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import FileUploader from "./file-uploader";
import { Button } from "./ui/button";

function MobileNavigation({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="search"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetHeader>
            <SheetTitle>
              <div className="header-user">
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={50}
                  height={50}
                  className="header-user-avatar"
                />
                <div className="text-left sm:hidden lg:block ">
                  <p className="subtitle-2 capitalize">{user.fullname}</p>
                  <p className="caption">{user.email}</p>
                </div>
              </div>
              <Separator className="my-4 bg-light-200/20" />
            </SheetTitle>
            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                {navItems.map((item) => {
                  const isActive = item.url === pathname;
                  return (
                    <Link href={item.url} key={item.url} className="lg:w-full">
                      <li
                        key={item.url}
                        className={cn("mobile-nav-item", {
                          "shad-active": isActive,
                        })}
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={24}
                          height={24}
                          className={cn("nav-icon", {
                            "nav-icon-active": isActive,
                          })}
                        />
                        <p>{item.name}</p>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </nav>
            <Separator className="my-4 bg-light-200/20" />
            <div className="flex flex-col justify-between gap-5 pb-5">
              <FileUploader accountId={user.accountId} ownerId={user.$id} />
              <Button
                type="submit"
                className="mobile-sign-out-button w-full flex-1"
                onClick={async () =>await handleLogout()}
              >
                <Image
                  src={"/assets/icons/logout.svg"}
                  alt="logout"
                  width={24}
                  height={24}
                />
                <p>Logout</p>
              </Button>
            </div>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default MobileNavigation;
