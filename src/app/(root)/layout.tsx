import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  let user: User | undefined;
  try {
    user = (await getCurrentUser()) as User;
    if (!user) return redirect("/sign-up");
  } catch (error) {
    return redirect("/sign-in");
  }
  return (
    <main className="flex h-screen">
      <Sidebar
        email={user.email}
        fullname={user.fullname!}
        avatar={user.avatar!}
      />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation user={user} />
        <Header accountId={user.accountId} userId={user.$id}/>
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
}

export default layout;
