import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {},
  plugins: [require("@headlessui/tailwindcss")],
};

export default config;
