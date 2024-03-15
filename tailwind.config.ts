import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "fast-bounce": "bounce 0.5s infinite", // Adjust the duration as needed, here it's set to 0.5s
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        "1/7": "14.2857143%", // Adjust the value based on your needs
        "6/7": "85.7142857%", // Adjust the value based on your needs
      },
      padding: {
        "17": "4.25rem",
        "17.5": "4.375rem",
        "17.75": "4.4375rem", // 17.75 * 0.25 = 4.4375rem
        "18": "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
