import Link from "next/link";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { api } from "$/lib/api";
import { RootLayout } from "$/components/RootLayout";
import Skeleton from "react-loading-skeleton";
import { CreateProjectButtonWithModal } from "$/components/modals/CreateProjectButtonWithModal";

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
                className="h-36 rounded-2xl border-2 bg-white p-5 duration-100 hover:shadow active:bg-gray-100/95"
              >
                {project.name}
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
