import Link from "next/link";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { api } from "$/lib/api";
import { RootLayout } from "$/components/RootLayout";
import Skeleton from "react-loading-skeleton";
import { CreateProjectButtonWithModal } from "$/components/modals/CreateProjectButtonWithModal";
import { ProjectIcon } from "$/components/ProjectIcon";

const Home: NextPageWithLayout = () => {
  const { data: projects, error, isLoading } = api.projects.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Pocketbee</title>
      </Head>

      <CreateProjectButtonWithModal />

      <div className="mt-12">
        {isLoading && !projects && <Skeleton count={6} />}

        {projects && projects.length > 0 && (
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {projects.map((project) => (
              <Link
                href={`/project/${project.id}`}
                key={project.id}
                className="flex h-48 flex-col justify-between rounded-2xl border-[0.5px] bg-white p-5 shadow duration-75 hover:-translate-y-[2px] hover:shadow-md focus:translate-y-0 active:bg-gray-100/95"
              >
                <ProjectIcon project={project} />
                <span className="text-2xl font-medium">{project.name}</span>
              </Link>
            ))}

            {projects && projects.length === 0 && <p>No projects (yet...)</p>}
          </div>
        )}
      </div>
    </>
  );
};

Home.getLayout = (page) => {
  return <RootLayout>{page}</RootLayout>;
};

export default Home;
