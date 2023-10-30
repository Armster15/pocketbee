import { useState } from "react";
import { DayPicker as ReactDayPicker, DateRange } from "react-day-picker";
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

export type DayPickerProps = React.ComponentProps<typeof ReactDayPicker>;

const options = [
  "Last hour",
  "Last 24 Hours",
  "Last 7 days",
  "Last 30 days",
  "Last 6 months",
];

export const DayPicker = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) => {
  const [dates, setDates] = useState<DateRange>();
  const [selected, setSelected] = useState(options[3]);

  return (
    <div className="flex">
      <Popover>
        <Float
          portal
          placement="bottom"
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
              selected={dates}
              // @ts-expect-error
              onSelect={setDates}
              {...props}
            />
          </Popover.Panel>
        </Float>
      </Popover>

      <Listbox as="div" value={selected} onChange={setSelected}>
        <Float
          portal
          placement="bottom-end"
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
            {selected}
            <IoChevronDown aria-hidden />
          </Listbox.Button>

          <Listbox.Options className="mt-1 min-w-[15ch] space-y-1 rounded-2xl border-2 bg-white p-1 shadow-lg">
            {options.map((option, index) => (
              <Listbox.Option
                value={option}
                key={index}
                className={
                  "ui-active:bg-gray-100 ui-selected:!bg-gray-200 cursor-pointer rounded-xl px-6 py-2 text-center"
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Float>
      </Listbox>
    </div>
  );
};
