import { useState } from "react";
import { type AppType } from "next/app";
import { api } from "$/utils/api";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  type Session,
} from "@supabase/auth-helpers-react";
import "$/styles/globals.css";

const MyApp: AppType<{
  initialSession: Session;
}> = ({ Component, pageProps }) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  );
};

export default api.withTRPC(MyApp);
