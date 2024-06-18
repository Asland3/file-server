import Transition from "../transition";
import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-14 min-h-screen">
      <div className="flex gap-8">
        <SideNav />

        <div className="w-full">
          <Transition>{children}</Transition>
        </div>
      </div>
    </main>
  );
}
