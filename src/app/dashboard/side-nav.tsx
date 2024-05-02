"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SideNav() {
  const pathname = usePathname();

  return (
    <div className="w-40 flex flex-col gap-4">
      <Button
        asChild
        variant={"outline"}
        className={clsx("flex gap-2 justify-start", {
          "bg-accent": pathname.includes("/dashboard/files"),
        })}
      >
        <Link href={"/dashboard/files"}>
          <FileIcon /> All Files
        </Link>
      </Button>

      <Button
        asChild
        variant={"outline"}
        className={clsx("flex gap-2 justify-start", {
          "bg-accent": pathname.includes("/dashboard/favorites"),
        })}
      >
        <Link href={"/dashboard/favorites"}>
          <StarIcon /> Favorites
        </Link>
      </Button>

      <Button
        asChild
        variant={"outline"}
        className={clsx("flex gap-2 justify-start", {
          "bg-accent": pathname.includes("/dashboard/trash"),
        })}
      >
        <Link href={"/dashboard/trash"}>
          <TrashIcon /> Trash
        </Link>
      </Button>
    </div>
  );
}

export default SideNav;
