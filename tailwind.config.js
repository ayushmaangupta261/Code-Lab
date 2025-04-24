/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    scrollbar: {
      thin: 'thin',
      rounded: 'rounded',
      thumb: 'scrollbar-thumb',
      track: 'scrollbar-track',
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
