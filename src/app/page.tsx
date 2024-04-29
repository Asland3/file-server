"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FileCard from "./file-card";
import SearchBar from "./search-bar";
import UploadButton from "./upload-button";

function Placeholder() {
  return (
    <div className="flex flex-col w-full items-center pt-10">
      <h1 className="text-3xl font-bold">No files found</h1>

      <p className="text-gray-500 mb-10">
        You can upload files using the button below
      </p>
      <UploadButton />
      <Image
        className="mt-10"
        alt="Image of no files"
        width={400}
        height={400}
        src={"files-and-folder-90.svg"}
      />
    </div>
  );
}

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-14">
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="animate-spin h-12 w-12" />
          <div className="text-2xl">Loading your images...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <SearchBar query={query} setQuery={setQuery} />

            <UploadButton />
          </div>

          {files.length === 0 && <Placeholder />}

          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}
