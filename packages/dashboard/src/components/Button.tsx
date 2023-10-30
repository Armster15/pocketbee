import { forwardRef } from "react";
import clsx from "clsx";
import type { ButtonProps } from "react-html-props";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, ...props }, ref) {
    return (
      <button
        className={clsx(
          "rounded-xl border-2 p-3 py-2 duration-100 hover:bg-gray-50/95 active:bg-gray-100",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
