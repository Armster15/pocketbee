import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { edenTreaty } from "@elysiajs/eden";
import { RootLayout } from "$/components/RootLayout";
import { ProjectLayout } from "$/components/ProjectLayout";
import { api } from "$/utils/api";
import { env } from "$/env.mjs";
import type { App as IngestionApi } from "@what-the-buzz/ingestion-api";
import { useSession } from "@supabase/auth-helpers-react";

const ingestionApi = edenTreaty<IngestionApi>(
  env.NEXT_PUBLIC_INGESTION_API_URL,
);

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  const {
    data: project,
    refetch: refetchProject,
    isLoading,
    isError,
  } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  const session = useSession();

  useEffect(() => {
    if (!projectId || !session) return;

    const ws = ingestionApi.ws.subscribe({
      $query: { projectId },
    });

    ws.on("message", ({ data: message }) => {
      console.info("WS >> ", message);

      if (message.event === "update") {
        refetchProject();
      } else if (message.event === "hello") {
        ws.send({
          event: "identify",
          data: session.access_token,
        });
      } else if (message.event === "error") {
        console.error("Error from WebSocket: ", message.data);
      }
    });

    return () => {
      ws.close();
    };
  }, [projectId, session]);

  if (!project) {
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p className="text-red-500">Error</p>;
  }

  return (
    <>
      <Head>
        <title>{project.name} | What the Buzz</title>
      </Head>

      <div className="flex w-fit items-center space-x-2 rounded-3xl bg-gray-100 px-4 py-3">
        <div className="h-4 w-4 rounded-full bg-green-500" />

        <p className="text-gray-700">{project.activeUsers.length} online</p>
      </div>
    </>
  );
};

ProjectPage.getLayout = (page) => {
  return (
    <RootLayout>
      <ProjectLayout>{page}</ProjectLayout>
    </RootLayout>
  );
};

export default ProjectPage;
