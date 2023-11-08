import { forwardRef } from "react";
import clsx from "clsx";
import type { InputProps } from "react-html-props";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      className={clsx(
        "rounded-xl border-2 border-gray-200/50 bg-gray-100 px-3 py-2 text-gray-700 duration-100 placeholder:text-gray-400",
        "outline-none ring-blue-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
