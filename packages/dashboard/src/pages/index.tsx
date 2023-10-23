import { api, vanillaApi } from "$/utils/api";

const PROJECT_TOKEN = "638d9389-f903-493c-a55b-f732e18c39d7";

export default function Home() {
  const { data, error } = api.main.activeUsers.useQuery({
    projectToken: PROJECT_TOKEN,
  });

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex items-center justify-center rounded-3xl bg-gray-200 px-6 py-4 text-3xl text-gray-700">
        <div className="h-6 w-6 rounded-full bg-green-500"></div>
        <span className="ml-3">{typeof data === "number" && data} online</span>
      </div>
    </main>
  );
}
