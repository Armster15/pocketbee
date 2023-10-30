import { type PropsWithChildren, type ComponentProps } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "$/lib/api";
import { IoStatsChart, IoSettings } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  const { data: project } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  return (
    <div className="md:flex">
      <aside className="mb-6 md:mb-0 md:mr-12 md:w-56">
        <h2 className="truncate text-2xl font-semibold">
          {project?.name ?? <Skeleton />}
        </h2>

        <div className="child:flex-1 mt-5 flex gap-1 md:grid">
          <ActiveLink href={`/project/${projectId}`}>
            <IoStatsChart aria-hidden />
            <span className="sr-only md:not-sr-only">Analytics</span>
          </ActiveLink>

          <ActiveLink href={`/project/${projectId}/settings`}>
            <IoSettings aria-hidden />
            <span className="sr-only md:not-sr-only">Settings</span>
          </ActiveLink>
        </div>
      </aside>

      <section className="flex-1">{children}</section>
    </div>
  );
};

const ActiveLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
  const router = useRouter();
  const active =
    new URL(href.toString(), "https://example.com").pathname ===
    new URL(router.asPath, "https://example.com").pathname;

  return (
    <Link
      className={clsx(
        "flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-700 duration-100 md:justify-start",
        "active:scale-90 md:active:scale-100",
        active ? "bg-gray-200/80" : "hover:bg-gray-100/80",
      )}
      href={href}
      {...props}
    />
  );
};
