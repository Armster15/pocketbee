import { useEffect, useRef } from "react";
import clsx from "clsx";
import { api } from "$/lib/api";
import Skeleton from "react-loading-skeleton";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const PING_CLASSNAME = "animate-[ping_1s_cubic-bezier(0,0,0.2,1)]";

export interface ActiveUsersProps {
  projectId: string | undefined;
}

export const ActiveUsersWidget = ({ projectId }: ActiveUsersProps) => {
  const supabase = useSupabaseClient();
  const pingRef = useRef<HTMLDivElement | null>(null);

  const { data: project } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  const {
    data: activeUsers,
    isLoading,
    isError,
    refetch: refetchActiveUsers,
  } = api.projects.getActiveUsers.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  useEffect(() => {
    if (!project) return;

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_events",
          filter: `project_token=eq.${project.token}`,
        },
        async (payload) => {
          console.log("PROJECT UPDATED!", payload);

          await refetchActiveUsers();

          pingRef.current?.classList.remove(PING_CLASSNAME);
          setTimeout(() => {
            pingRef.current?.classList.add(PING_CLASSNAME);
          }, 100);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project]);

  return (
    <div className="flex h-48 w-48 flex-col justify-between rounded-2xl border-2 p-4">
      {(() => {
        if (isLoading && !activeUsers) return <Skeleton count={6} />;
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
              <p className="my-1 text-7xl">{activeUsers}</p>
              <p className="text-gray-500">
                <span className="sr-only">users </span>online now
              </p>
            </div>
          </>
        );
      })()}
    </div>
  );
};
