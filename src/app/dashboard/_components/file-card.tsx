import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelative } from "date-fns";

import { useQuery } from "convex/react";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { FileCardActions } from "./file-actions";

export function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean; url: string | null };
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  let deletionTimeText = "";

  if (file.shouldDelete) {
    const deletionTime = file.markedForDeletionAt! + 24 * 60 * 60 * 1000; // 24 hours after the file was marked for deletion
    deletionTimeText = `File will be deleted ${formatRelative(deletionTime, new Date())}`;
  }

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          <p className="truncate">{file.name}</p>
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center mb-2 mt-2">
        {file.type === "image" && file.url && (
          <Image
            className="rounded-md max-h-[200px] max-w-[200px]"
            alt={file.name}
            width={200}
            height={200}
            src={file.url}
            priority
          />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
            <Avatar className="w-6 h-6">
              <AvatarImage src={userProfile?.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userProfile?.name}
          </div>
          <div className="text-xs text-gray-700 flex items-center">
            Uploaded {formatRelative(new Date(file._creationTime), new Date())}
          </div>
        </div>
        <div className="pt-5">
          {file.shouldDelete && (
            <div className="text-sm text-gray-700 font-bold">
              {deletionTimeText}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
