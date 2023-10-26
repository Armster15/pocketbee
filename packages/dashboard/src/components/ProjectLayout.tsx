import { type PropsWithChildren, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "$/utils/api";

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

        <div className="grid">
          <ActiveLink href={`/project/${projectId}`}>Analytics</ActiveLink>
          <ActiveLink href={`/project/${projectId}/settings`}>
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
    <Link className={active ? "bg-yellow-300" : ""} href={href} {...props} />
  );
};
