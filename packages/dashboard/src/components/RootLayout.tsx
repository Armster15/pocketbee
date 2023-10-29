import { type PropsWithChildren } from "react";
import Link from "next/link";
import { UserDropdown } from "$/components/UserDropdown";

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen px-5 py-8 sm:px-8">
      <nav className="flex items-center justify-between">
        <Link href="/">
          <h1 className="text-3xl font-semibold underline">Pocketbee</h1>
        </Link>

        <UserDropdown />
      </nav>
      <main className="mt-6">{children}</main>
    </div>
  );
};
