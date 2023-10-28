import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import clsx from "clsx";
import { NextPageWithLayout } from "$/pages/_app";
import { edenTreaty } from "@elysiajs/eden";
import { RootLayout } from "$/components/RootLayout";
import { ProjectLayout } from "$/components/ProjectLayout";
import { api } from "$/utils/api";
import { env } from "$/env.mjs";
import type { App as IngestionApi } from "@pocketbee/ingestion-api";
import { useSession } from "@supabase/auth-helpers-react";
import Skeleton from "react-loading-skeleton";

const ingestionApi = edenTreaty<IngestionApi>(
  env.NEXT_PUBLIC_INGESTION_API_URL,
);

const PING_CLASSNAME = "animate-[ping_1s_cubic-bezier(0,0,0.2,1)]";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;
  const pingRef = useRef<HTMLDivElement | null>(null);

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
        pingRef.current?.classList.remove(PING_CLASSNAME);
        setTimeout(() => {
          pingRef.current?.classList.add(PING_CLASSNAME);
        }, 100);
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

  // if (!project) {
  //   if (isLoading) return <p>Loading...</p>;
  //   if (isError) return <p className="text-red-500">Error</p>;
  // }

  return (
    <>
      <Head>
        <title>
          {project?.name ? `${project.name} | Pocketbee` : "Pocketbee"}
        </title>
      </Head>

      <div className="flex h-48 w-48 flex-col justify-between rounded-2xl border-2 p-4">
        {(() => {
          if (isLoading && !project) return <Skeleton count={6} />;
          if (isError) return <p className="text-red-500">An error occurred</p>;

          return (
            <>
              <div className="relative">
                <div className="absolute h-5 w-5 rounded-full bg-green-500" />
                <div
                  ref={pingRef}
                  className={clsx(
                    `absolute h-5 w-5 rounded-full bg-green-500`,
                    PING_CLASSNAME,
                  )}
                />
              </div>

              <div>
                <p className="my-1 text-7xl">{project.active_users.length}</p>
                <p className="text-gray-500">
                  <span className="sr-only">users </span>online now
                </p>
              </div>
            </>
          );
        })()}
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
