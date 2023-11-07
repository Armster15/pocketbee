import { useEffect, useState } from "react";
import clsx from "clsx";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { IoPerson } from "react-icons/io5";
import { api, type RouterInputs } from "$/lib/api";
import Skeleton from "react-loading-skeleton";
import { DayPicker } from "$/components/DayPicker";
import {
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfHour,
  endOfHour,
} from "date-fns";
import { getGroupingInterval } from "$/lib/utils";
import type { DivProps } from "react-html-props";
import { useAtom } from "jotai";
import { rangeAtom } from "$/lib/atoms";

type Data = { date: Date; sessions: number };
type GetSessionsInputs = RouterInputs["projects"]["getSessions"];

export interface SessionsWidgetProps extends DivProps {
  projectId: string | undefined;
}

export const SessionsWidget = ({
  projectId,
  className,
  ...props
}: SessionsWidgetProps) => {
  const [timeZone, setTimeZone] = useState<string>();
  const [range, setRange] = useAtom(rangeAtom);
  const { from, to } = range;
  const groupingInterval = getGroupingInterval(from, to);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const { data, isInitialLoading, isError, isPreviousData } =
    api.projects.getSessions.useQuery<Data[]>(
      {
        projectId: projectId!,
        timeZone: timeZone!,
        groupingInterval,
        from,
        to,
      },
      { enabled: !!projectId && !!timeZone, keepPreviousData: true },
    );

  return (
    <div
      className={clsx(
        "flex flex-col justify-between rounded-2xl border-2 p-4 pb-0",
        className,
      )}
      {...props}
    >
      {(() => {
        if (isInitialLoading) return <Skeleton count={8} />;
        if (isError) return <p className="text-red-500">An error occurred</p>;

        return (
          <>
            <div className="flex justify-between">
              <h3 className="px-2 pt-1 text-xl font-semibold">Sessions</h3>
              {/* <DayPicker /> */}
            </div>

            <ResponsiveContainer width={"100%"} height={"80%"}>
              <BarChart data={data}>
                <Bar
                  className="cursor-pointer"
                  onClick={({ date }: Data) => {
                    if (groupingInterval === "hour") {
                      setRange({
                        from: startOfHour(date),
                        to: endOfHour(date),
                      });
                    } else if (groupingInterval === "day") {
                      setRange({
                        from: startOfDay(date),
                        to: endOfDay(date),
                      });
                    } else if (groupingInterval === "month") {
                      setRange({
                        from: startOfMonth(date),
                        to: endOfMonth(date),
                      });
                    } else if (groupingInterval === "year") {
                      setRange({
                        from: startOfYear(date),
                        to: endOfYear(date),
                      });
                    }
                  }}
                  dataKey="sessions"
                  fill="#8884d8"
                  opacity={isPreviousData ? "0.7" : undefined}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date: Date) => {
                    if (isPreviousData) return "";

                    // 10 minute intervals
                    if (groupingInterval === "10min") {
                      return date.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      // + "-" +
                      // addMinutes(date, 10).toLocaleTimeString(undefined, {
                      //   hour: "2-digit",
                      //   minute: "2-digit",
                      // })
                    }

                    // Hour intervals
                    else if (groupingInterval === "hour") {
                      return date.toLocaleTimeString(undefined, {
                        hour12: true,
                        hour: "numeric",
                      });
                    }

                    // Day intervals
                    else if (groupingInterval === "day") {
                      const month = date.toLocaleString("default", {
                        month: "short",
                      });
                      const day = date.getUTCDate();
                      return month + " " + day;
                    }

                    // Month intervals
                    else if (groupingInterval === "month") {
                      return date.toLocaleString("default", {
                        month: "short",
                      });
                    }

                    // Year intervals
                    else if (groupingInterval === "year") {
                      return String(date.getUTCFullYear());
                    }

                    return "Not implemented"; // This should not happen
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
          </>
        );
      })()}
    </div>
  );
};
