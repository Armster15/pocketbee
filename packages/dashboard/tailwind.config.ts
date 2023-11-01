import plugin from "tailwindcss/plugin";
import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {},
  plugins: [
    require("@headlessui/tailwindcss"),
    require("tailwind-children"),
    plugin(function ({ addVariant }) {
      addVariant("not-hover", "&:not(:hover)");
      addVariant("not-active", "&:not(:active)");
      addVariant("not-focus", "&:not(:focus)");
      addVariant("not-focus-visible", "&:not(:focus-visible)");
      addVariant("not-disabled", "&:not([disabled])");
    }),
  ],
};

export default config;
