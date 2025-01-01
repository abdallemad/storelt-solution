"use client";
import { usePathname } from "next/navigation";
import { AVATAR_PLACEHOLDER_URL, navItems } from "@/lib/constance";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

function Sidebar({email,fullname, avatar}:{email:string, fullname:string, avatar:string}) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href={"/"}>
        <Image
          src={"/assets/icons/logo-full-brand.svg"}
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src={"/assets/icons/logo-brand.svg"}
          alt="logo"
          width={52}
          height={52}
          className="h-auto lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map((item) => {
            const isActive = item.url === pathname;
            return (
              <Link href={item.url} key={item.url} className="lg:w-full">
                <li
                  key={item.url}
                  className={cn("sidebar-nav-item", {
                    "shad-active": isActive,
                  })}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                    className={cn("nav-icon", { "nav-icon-active": isActive })}
                  />
                  <p className="hidden lg:block">{item.name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullname}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
