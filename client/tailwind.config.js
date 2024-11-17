/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}", "./public/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "light-gray": "#F9FAFB",
        "light-gray-2": "#EFF2F6",
        "light-gray-3": "#E5E8EB",
        "gray-1": "#B0B4BB",
        "gray-2": "#8A8F99",
        "dark-gray-1": "#646C77",
        "dark-gray-2": "#434A54",
        "dark-gray-3": "#2E333B",
        black: "#1C1F23",

        "light-blue": "#EAF4FC",
        "primary-blue": "#5B9ED8",
        "dark-blue": "#3A6E98",

        "light-green": "#E7F3EA",
        "primary-green": "#4D9467",
        "dark-green": "#356749",

        "warning-light": "#FFE6CC",
        warning: "#F5A623",
        danger: "#E63946",
        "danger-light": "#FDEDEE",

        "success-light": "#D6F5E6",
        success: "#43A047",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "bad-script": ["Bad Script", "cursive"],
        quattrocento: ["Quattrocento", "serif"],
      },
    },
  },
  plugins: [],
}
