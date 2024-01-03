module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        'ridiculous': '0 10px 350px -12px rgba(1, 1, 1, 0.5)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
