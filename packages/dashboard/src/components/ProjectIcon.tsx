import clsx from "clsx";
import type { RouterOutputs } from "$/lib/api";
import type { DivProps, ImgProps } from "react-html-props";

type DivAndImgProps = Omit<DivProps & ImgProps, "children">;
export interface ProjectIconProps extends DivAndImgProps {
  project: RouterOutputs["projects"]["get"];
}

export const ProjectIcon = ({
  project,
  className,
  ...props
}: ProjectIconProps) => {
  if (project.image_url) {
    return (
      <img
        src={project.image_url}
        alt={`Project icon for ${project.name}`}
        width={64}
        height={64}
        className={clsx("rounded-2xl shadow", className)}
        {...props}
      />
    );
  }

  return (
    <div
      aria-label={`Project icon for ${project.name}`}
      className={clsx(
        "flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-xl text-gray-700 shadow",
        className,
      )}
      {...props}
    >
      <p className="mx-1 truncate">
        {project.name
          .split(" ")
          .map((word) => word[0])
          .join("")}
      </p>
    </div>
  );
};
