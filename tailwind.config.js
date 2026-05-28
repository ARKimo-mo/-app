/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2F6BFF",
        mint: "#3DCEA4",
        lavender: "#8B5CF6",
        ink: "#17213D"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(47, 107, 255, 0.10)",
        card: "0 10px 32px rgba(23, 33, 61, 0.07)"
      },
      borderRadius: {
        "3xl": "1.5rem"
      }
    }
  },
  plugins: []
};
