import componentConfig from '../../packages/components/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [componentConfig],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/designer/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/components/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
