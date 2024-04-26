/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{js,css}",
    "./views/**/*.ejs",
    "./node_modules/tw-elements/js/**/*.js",
  ],
  darkMode: "class",
  plugins: [require("tw-elements/plugin.cjs"), require("daisyui")],
  daisyui: {
    themes: ["light"],
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
