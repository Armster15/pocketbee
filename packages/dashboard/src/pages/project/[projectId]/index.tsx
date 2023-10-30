import { useRouter } from "next/router";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { RootLayout } from "$/components/RootLayout";
import { ProjectLayout } from "$/components/ProjectLayout";
import { api } from "$/lib/api";
import { ActiveUsersWidget } from "$/components/widgets/ActiveUsers";
import { SessionsWidget } from "$/components/widgets/Sessions";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  const { data: project } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  return (
    <>
      <Head>
        <title>
          {project?.name ? `${project.name} | Pocketbee` : "Pocketbee"}
        </title>
      </Head>

      <div className="child:h-52 sm:child:h-56 grid-cols-3 space-y-6 sm:grid sm:gap-6 sm:space-y-0">
        <ActiveUsersWidget projectId={projectId} />
        <SessionsWidget className="col-span-2" projectId={projectId} />
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
