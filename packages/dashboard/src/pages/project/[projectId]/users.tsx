import { useRouter } from "next/router";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { RootLayout } from "$/components/RootLayout";
import { ProjectLayout } from "$/components/ProjectLayout";
import { api } from "$/lib/api";

const ProjectUsersPage: NextPageWithLayout = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  // if (!project) {
  //   if (isLoading) return <Skeleton count={7} />;
  //   if (isError) return <p className="text-red-500">Error</p>;
  // }

  return (
    <>
      <Head>
        <title>Users | Pocketbee</title>
      </Head>

      <h3 className="mb-6 text-3xl font-bold">Users</h3>
    </>
  );
};

ProjectUsersPage.getLayout = (page) => {
  return (
    <RootLayout>
      <ProjectLayout>{page}</ProjectLayout>
    </RootLayout>
  );
};

export default ProjectUsersPage;
