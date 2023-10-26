import { type PropsWithChildren } from "react";
import Link from "next/link";

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen p-8">
      <nav>
        <Link href="/">
          <h1 className="text-3xl font-semibold underline">What the Buzz</h1>
        </Link>
      </nav>
      <main className="mt-6">{children}</main>
    </div>
  );
};
