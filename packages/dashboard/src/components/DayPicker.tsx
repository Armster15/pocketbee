import { useState } from "react";
import { DayPicker as ReactDayPicker } from "react-day-picker";
import clsx from "clsx";
import {
  IoCalendarClear,
  IoChevronBack,
  IoChevronForward,
  IoChevronDown,
} from "react-icons/io5";
import { Popover, Listbox } from "@headlessui/react";
import { Button } from "$/components/Button";
import { Float } from "@headlessui-float/react";
import {
  getDefaultRange,
  last7DaysRange,
  last24HoursRange,
  last30DaysRange,
  type Range,
} from "$/lib/range";
import { startOfDay, endOfDay } from "date-fns";

type OptionFn = { option: string; fn: () => Range };
const OPTIONS_FN_MAP: OptionFn[] = [
  { option: "Last 24 hours", fn: last24HoursRange },
  { option: "Last 7 days", fn: last7DaysRange },
  { option: "Last 30 days", fn: last30DaysRange },
];

export type DayPickerProps = React.ComponentProps<typeof ReactDayPicker> & {
  range: Range;
  setRange: (range: Range) => void;
};

export const DayPicker = ({
  className,
  classNames,
  range,
  setRange,
  showOutsideDays = true,
  ...props
}: DayPickerProps) => {
  const [rangeDraft, setRangeDraft] = useState<Range>(range);
  const [rangeLabel, setRangeLabel] = useState<Range | string>(range);

  return (
    <div className="flex">
      <Popover>
        {({ open }) => (
          <Float
            portal
            autoPlacement
            autoUpdate={{
              layoutShift: !open,
            }}
            onShow={() => {
              setRangeDraft(range);
            }}
            onHide={() => {
              setRange(rangeDraft);
              setRangeLabel(rangeDraft);
            }}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Button
              as={Button}
              className={"h-full rounded-r-none border-r-0"}
              aria-label="Choose custom date range"
            >
              <IoCalendarClear aria-hidden />
            </Popover.Button>

            <Popover.Panel className="mt-1 rounded-2xl border-2 bg-white shadow-lg">
              <ReactDayPicker
                mode="range"
                initialFocus
                showOutsideDays={showOutsideDays}
                className={clsx("p-3", className)}
                components={{
                  IconLeft: ({ ...props }) => (
                    <IoChevronBack className="h-4 w-4" />
                  ),
                  IconRight: ({ ...props }) => (
                    <IoChevronForward className="h-4 w-4" />
                  ),
                }}
                selected={rangeDraft}
                // @ts-expect-error
                onSelect={(newRange) => {
                  if (!newRange || !newRange.from) {
                    setRangeDraft(getDefaultRange());
                  } else if (!newRange.to) {
                    setRangeDraft({
                      from: startOfDay(newRange.from),
                      to: endOfDay(newRange.from),
                    });
                  } else {
                    setRangeDraft({
                      from: startOfDay(newRange.from),
                      to: endOfDay(newRange.to),
                    });
                  }
                }}
                {...props}
              />
            </Popover.Panel>
          </Float>
        )}
      </Popover>

      <Listbox
        as="div"
        onChange={({ option, fn }: OptionFn) => {
          setRange(fn());
          setRangeLabel(option);
        }}
      >
        <Float
          portal
          autoPlacement={{
            allowedPlacements: ["bottom-end", "top-end"],
          }}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Listbox.Button
            as={Button}
            className={"flex h-full items-center gap-2 rounded-l-none"}
          >
            {(() => {
              if (typeof rangeLabel === "string") {
                return rangeLabel;
              }

              const intlDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return intlDateTimeFormatter.formatRange(
                rangeLabel.from,
                rangeLabel.to,
              );
            })()}
            <IoChevronDown aria-hidden />
          </Listbox.Button>

          <Listbox.Options className="mt-1 min-w-[15ch] space-y-1 rounded-2xl border-2 bg-white p-1 shadow-lg">
            {OPTIONS_FN_MAP.map((val, index) => (
              <Listbox.Option
                value={val}
                key={index}
                className={
                  "ui-active:bg-gray-100 ui-selected:!bg-gray-200 cursor-pointer rounded-xl px-6 py-2 text-center"
                }
              >
                {val.option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Float>
      </Listbox>
    </div>
  );
};
