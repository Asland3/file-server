"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import Image from "next/image";
import FileCard from "./file-card";
import UploadButton from "./upload-button";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-14">
      {!isLoading && files.length === 0 && (
        <div className="flex flex-col w-full items-center">
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
      )}

      {!isLoading && files.length > 0 && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <UploadButton />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
