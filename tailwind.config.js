module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        themeGrey: '#d6d6d6',
        themeYellow: '#ffee32',
        themeOrange: '#ffd100',
        themeBlack: '#202020',
        themeDarkGrey: '#333533',
      },
      fontFamily: {
        body: ['Quicksand', 'Nunito'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
