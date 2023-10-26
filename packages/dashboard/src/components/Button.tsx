import type { ButtonProps } from "react-html-props";
import clsx from "clsx";

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        "rounded-xl border-2 p-3 py-2 duration-100 hover:bg-gray-50/95 active:bg-gray-100",
        className,
      )}
      {...props}
    />
  );
};
