import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-8">
          <div className="text-center">
            <Image
              src="/logo.png"
              width="200"
              height="200"
              alt="file drive logo"
              className="inline-block mb-8"
            />

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              The easiest way to upload and share files with your company
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Make and account and start managing your files in less than a
              minute.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <SignedOut>
                <Button asChild size={"lg"} className="w-80">
                  <Link href="/dashboard/files">Get started</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <Button asChild size={"lg"} className="w-80">
                  <Link href="/dashboard/files">Go to your files</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
