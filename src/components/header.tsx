import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./search";
import FileUploader from "./file-uploader";
import { handleLogout } from "@/lib/actions/user.action";

function Header({accountId, userId}:{accountId:string, userId:string}) {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader accountId={accountId} ownerId={userId}/>
        <form
          action={async () => {
            "use server";
            await handleLogout();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src={"/assets/icons/logout.svg"}
              alt="logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
}

export default Header;
