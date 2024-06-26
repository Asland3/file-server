"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { GridIcon, RowsIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { columns } from "./columns";
import { FileCard } from "./file-card";
import { DataTable } from "./file-table";
import SearchBar from "./search-bar";
import UploadButton from "./upload-button";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/no-Image.svg"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  const [tabValue, setTabValue] = useState(
    localStorage.getItem("tabValue") ?? "grid"
  );

  useEffect(() => {
    localStorage.setItem("tabValue", tabValue);
  }, [tabValue]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>

      <Tabs defaultValue={tabValue}>
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger
              value="grid"
              className="flex gap-2 items-center"
              onClick={() => setTabValue("grid")}
            >
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="flex gap-2 items-center"
              onClick={() => setTabValue("table")}
            >
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType: any) => {
                setType(newType);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns as any} data={modifiedFiles} />
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder />}
    </div>
  );
}
