import { forwardRef } from "react";
import clsx from "clsx";
import type { InputProps } from "react-html-props";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      className={clsx("rounded-2xl border-2 p-2", className)}
      ref={ref}
      {...props}
    />
  );
});
