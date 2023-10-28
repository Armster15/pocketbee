import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Component() {
  const supabase = createClientComponentClient();
  const authRedirectUrl = new URL(
    "/api/auth/callback",
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      `http://localhost:3000`,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-5 text-2xl font-semibold">Auth</h1>
      <Auth
        supabaseClient={supabase}
        view="magic_link"
        appearance={{ theme: ThemeSupa }}
        showLinks={false}
        providers={["github"]}
        redirectTo={authRedirectUrl.toString()}
      />
    </div>
  );
}
