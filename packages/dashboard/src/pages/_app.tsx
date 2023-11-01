import { useState, type ReactElement, type ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps, AppType } from "next/app";
import { api } from "$/lib/api";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  type Session,
} from "@supabase/auth-helpers-react";
import "$/styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-day-picker/dist/style.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // @ts-ignore
  import("@khanacademy/tota11y");
}

const MyApp: AppType<{
  initialSession: Session;
}> = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      {getLayout(<Component {...pageProps} />)}
    </SessionContextProvider>
  );
};

export default api.withTRPC(MyApp);
