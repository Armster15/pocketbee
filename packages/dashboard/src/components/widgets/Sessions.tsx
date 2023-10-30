import clsx from "clsx";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { IoPerson } from "react-icons/io5";
import { api } from "$/lib/api";
import Skeleton from "react-loading-skeleton";
import type { DivProps } from "react-html-props";

type Data = { date: Date; sessions: number };

export interface SessionsWidgetProps extends DivProps {
  projectId: string | undefined;
}

export const SessionsWidget = ({
  projectId,
  className,
  ...props
}: SessionsWidgetProps) => {
  const { data: project } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );

  return (
    <div
      className={clsx(
        "flex flex-col justify-between rounded-2xl border-2 p-4 pb-0",
        className,
      )}
      {...props}
    >
      <h3 className="px-2 pt-1 text-xl font-semibold">Sessions</h3>

      {project && (
        <ResponsiveContainer width={"100%"} height={"80%"}>
          <BarChart data={data}>
            <Bar dataKey="sessions" fill="#8884d8" />
            <XAxis
              dataKey="date"
              tickFormatter={(date: Date) => {
                const month = date.toLocaleString("default", {
                  month: "short",
                });
                const day = date.getUTCDate();
                return month + " " + day;
              }}
              stroke="#8884d8"
            />

            <Tooltip
              content={({ payload }) => {
                if (payload && payload[0] && payload[0].payload) {
                  const data = payload[0].payload as Data;

                  return (
                    <div className="rounded border bg-white p-3 text-center shadow-md">
                      <p className="flex items-center justify-center gap-2 text-gray-800">
                        <IoPerson aria-hidden />
                        {data.sessions.toLocaleString()}
                        <span className="sr-only"> sessions</span>
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {data.date.toLocaleDateString()}
                      </p>
                    </div>
                  );
                }
              }}
              cursor={false}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const data: Data[] = [
  {
    date: new Date("2023-10-25"),
    sessions: 7019,
  },
  {
    date: new Date("2023-10-26"),
    sessions: 7334,
  },
  {
    date: new Date("2023-10-27"),
    sessions: 7068,
  },
  {
    date: new Date("2023-10-28"),
    sessions: 7749,
  },
  {
    date: new Date("2023-10-29"),
    sessions: 6816,
  },
  {
    date: new Date("2023-10-30"),
    sessions: 3089,
  },
  {
    date: new Date("2023-10-31"),
    sessions: 3858,
  },
];
