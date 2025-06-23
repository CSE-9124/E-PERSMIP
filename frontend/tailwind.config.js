/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        persmip: {
          "primary": "#be123c", // merah utama unhas
          "secondary": "#fca5a5", // merah muda
          "accent": "#f59e0b",
          "neutral": "#f3f4f6", // abu muda
          "base-100": "#ffffff",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "light"
    ],
    base: true,
    styled: true,
    utils: true,
    darkTheme: false, // nonaktifkan dark mode
  },
}
