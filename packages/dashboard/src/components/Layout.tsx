import type { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <nav>
        <h1 className="text-3xl font-semibold">What the Buzz</h1>
      </nav>
      <main className="mt-6">{children}</main>
    </div>
  );
};
