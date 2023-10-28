import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthPage() {
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | undefined>(
    undefined,
  );
  const supabase = createClientComponentClient();

  useEffect(() => {
    setAuthRedirectUrl(
      new URL("/api/auth/callback", window.location.origin).toString(),
    );
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-5 text-2xl font-semibold">Auth</h1>
      <Auth
        supabaseClient={supabase}
        view="magic_link"
        appearance={{ theme: ThemeSupa }}
        showLinks={false}
        providers={["github"]}
        redirectTo={authRedirectUrl}
      />
    </div>
  );
}
