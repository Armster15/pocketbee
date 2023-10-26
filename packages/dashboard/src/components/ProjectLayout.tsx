import { type PropsWithChildren, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "$/utils/api";
import clsx from "clsx";
import { IoStatsChart, IoSettings } from "react-icons/io5";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  const { data: project } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  return (
    <div className="flex">
      <aside className="mr-12 w-56">
        <h2 className="truncate text-2xl font-semibold">{project?.name}</h2>

        <div className="mt-5 grid gap-1">
          <ActiveLink href={`/project/${projectId}`}>
            <IoStatsChart aria-hidden />
            Analytics
          </ActiveLink>
          <ActiveLink href={`/project/${projectId}/settings`}>
            <IoSettings aria-hidden />
            Settings
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
        "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 duration-100",
        active ? "bg-gray-200/80" : "hover:bg-gray-100",
      )}
      href={href}
      {...props}
    />
  );
};
