module.exports = {
  content: ['./views/**/*.ejs', './public/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
}
