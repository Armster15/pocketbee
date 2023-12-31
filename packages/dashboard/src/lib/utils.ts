import { type RouterInputs } from "$/lib/api";
import {
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

/** Get best grouping interval for two dates */
export function getGroupingInterval(
  from: Date,
  to: Date,
): RouterInputs["projects"]["getSessions"]["groupingInterval"] {
  if (differenceInHours(from, to) === 0) {
    return "10min";
  }
  // Use hour group interval if span is two days or less
  else if (Math.abs(differenceInDays(from, to)) <= 1) {
    return "hour";
  } else if (differenceInMonths(from, to) === 0) {
    return "day";
  } else if (differenceInYears(from, to) === 0) {
    return "month";
  }
  return "year";
}

/** https://stackoverflow.com/a/38182068/5721784 */
export const invalidDate = (date: Date) => isNaN(date.getTime());
