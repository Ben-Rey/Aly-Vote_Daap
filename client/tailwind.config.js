/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  // daisyui: {
  //   themes: [
  //     {
  //       // mytheme: {
  //       //   // primary: '#1e293b',
  //       //   // 'base-100': '#ffffff',
  //       //   // neutral: '#3d4451',
  //       //   // primary: '#1e293b',
  //       //   'base-100': '#ffffff'
  //       // }
  //     }
  //   ]
  // },

  theme: {
    extend: {
      colors: {
        'perso-100': '##fffaf3',
        gold: 'linear-gradient(to right, rgb(254, 240, 138), rgb(250, 204, 21), rgb(161, 98, 7))'
      },
      backgroundImage: {
        'main-gradient': "url('/src/assets/pictures/png/bg.png')",
        tropical: "url('/src/assets/pictures/png/tropical.png')",
        'split-white-black':
          'linear-gradient(to bottom, #111827 60% , white 40%);'
      },
      fontFamily: {
        header: ['"Bungee"', 'cursive']
      }
    }
  },
  plugins: [require('daisyui')]
}
