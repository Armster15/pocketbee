import { atomWithHash } from "jotai-location";
import { Router } from "next/router";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { invalidDate } from "$/lib/utils";

export type Range = {
  from: Date;
  to: Date;
};

export function getDefaultRange(): Range {
  return {
    from: subDays(startOfDay(new Date()), 6),
    to: endOfDay(new Date()),
  };
}

export const rangeAtom = atomWithHash<Range>("range", getDefaultRange(), {
  serialize: ({ from, to }) =>
    new URLSearchParams({
      from: from.getTime().toString(),
      to: to.getTime().toString(),
    }).toString(),

  deserialize: (str) => {
    const searchParams = new URLSearchParams(str);

    const fromStr = searchParams.get("from") ?? NaN;
    const toStr = searchParams.get("to") ?? NaN;

    const fromDate = new Date(Number(fromStr));
    const toDate = new Date(Number(toStr));

    if (invalidDate(fromDate) || invalidDate(toDate)) {
      return getDefaultRange();
    }

    return {
      from: fromDate,
      to: toDate,
    };
  },

  subscribe: (callback) => {
    Router.events.on("routeChangeComplete", callback);
    window.addEventListener("hashchange", callback);
    return () => {
      Router.events.off("routeChangeComplete", callback);
      window.removeEventListener("hashchange", callback);
    };
  },
});
