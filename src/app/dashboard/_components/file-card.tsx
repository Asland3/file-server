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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id });

                toast({
                  variant: "success",
                  title: "File Deleted",
                  description: "Your file has been deleted successfully",
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
            onClick={() => {
              toggleFavorite({ fileId: file._id });
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {isFavorited ? (
              <div className="flex gap-1 items-center">
                <StarIcon /> Unfavorite
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <StarHalf /> Favorite
              </div>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsConfirmOpen(true);
            }}
            className="flex gap-1 text-red-600 items-center cursor-pointer"
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function FileCard({
  file,
  favorites,
}: {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
}) {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );

  return (
    <div>
      <Card>
        <CardHeader className="relative">
          <CardTitle className="flex gap-2">
            <div className="flex justify-center">{typeIcons[file.type]}</div>
            {file.name}
          </CardTitle>
          <div className="absolute top-2 right-2">
            <FileCardActions isFavorited={isFavorited} file={file} />
          </div>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="h-[200px] flex justify-center items-center">
          {file.type === "image" && (
            <Image alt={file.name} width={200} height={100} src={""} />
          )}

          {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
          {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => {
              window.open(getFileUrl(file._id), "_blank");
            }}
          >
            Download
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
