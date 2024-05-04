import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { FileIcon, MoreVertical, TrashIcon, UndoIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

export async function downloladFile(
  file: Doc<"files"> & { url: string | null }
) {
  if (!file.url) return;
  const response = fetch(file.url);
  const blob = (await response).blob();
  const url = window.URL.createObjectURL(await blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "file");
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

export function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files"> & { url: string | null };
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const { toast } = useToast();
  const me = useQuery(api.users.getMe);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast({
                  variant: "default",
                  title: "File marked for deletion",
                  description: "Your file will be deleted soon",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              downloladFile(file);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <FileIcon className="w-4 h-4" /> Download
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({
                fileId: file._id,
              });
              if (isFavorited) {
                toast({
                  variant: "default",
                  title: "File unfavorited",
                  description: "This file has been removed from your favorites",
                });
              } else {
                toast({
                  variant: "default",
                  title: "File favorited",
                  description: "This file has been added to your favorites",
                });
              }
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {isFavorited ? (
              <div className="flex gap-1 items-center ml-[-2px]">
                <Image
                  src="/star-filled.svg"
                  width={20}
                  height={20}
                  alt="Unfavorite"
                />
                Unfavorite
              </div>
            ) : (
              <div className="flex gap-1 items-center ml-[-2px]">
                <Image src="/star.svg" width={20} height={20} alt="Favorite" />
                Favorite
              </div>
            )}
          </DropdownMenuItem>

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={
              <DropdownMenuItem
                className="flex gap-1 items-center text-red-600"
                disabled
              >
                <TrashIcon className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            }
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({
                    fileId: file._id,
                  });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              {file.shouldDelete ? (
                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                  <UndoIcon className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                  <TrashIcon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
