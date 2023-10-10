/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/presentation/web/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/web/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/web/components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
