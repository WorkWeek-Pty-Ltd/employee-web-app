import type { Config } from "tailwindcss";

const config: Config = {
  // Remove or comment out the 'purge' field as 'content' replaces it in Tailwind CSS v3.0
  // purge: [
  //   "./pages/**/*.{js,ts,jsx,tsx}",
  //   "./components/**/*.{js,ts,jsx,tsx}",
  //   "./styles/**/*.{css}",
  // ],
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Including styles directory with the corrected glob pattern
    "./styles/**/*.css", // Corrected glob pattern for CSS files
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "dark-blue": "#1d2021",
        "light-grey": "#f2f2f2",
        black: "#000000",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
export default config;
