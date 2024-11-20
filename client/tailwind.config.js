/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}", "./public/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        light: {
          background: "#FFFFFF",
          background2: "#F0F0F0",
          background3: "#E0E0E0",
          primary: "#5B9ED8",
          secondary: "#F9FAFB",
          text: "#434A54",
          textSecondary: "#8A8F99",
          border: "#E5E8EB",
          button: {
            DEFAULT: "#5B9ED8",
            hover: "#3A6E98",
          },
          success: "#43A047",
          warning: "#F5A623",
          danger: "#E63946",
        },
        // Dark Mode Colors
        dark: {
          background: "#111827",
          background2: "#161f30",
          background3: "#1d2a44",
          primary: "#5B9ED8",
          secondary: "#2E333B",
          text: "#F9FAFB",
          textSecondary: "#B0B4BB",
          border: "#646C77",
          button: {
            DEFAULT: "#5B9ED8",
            hover: "#3A6E98",
          },
          success: "#43A047",
          warning: "#F5A623",
          danger: "#E63946",
        },
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
