import { forwardRef } from "react";
import clsx from "clsx";
import type { ButtonProps } from "react-html-props";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, ...props }, ref) {
    return (
      <button
        className={clsx(
          "not-disabled:hover:bg-gray-50/95 not-disabled:active:bg-gray-100 rounded-xl border-2 p-3 py-2 outline-none ring-gray-300 duration-100 focus-visible:ring-2",
          "disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
