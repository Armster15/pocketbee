import type { ButtonProps } from "react-html-props";
import clsx from "clsx";

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        "rounded-2xl bg-white p-3 hover:shadow-md active:bg-gray-100/95",
        className,
      )}
      {...props}
    />
  );
};
