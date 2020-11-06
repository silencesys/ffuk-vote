module.exports = {
  theme: {
    extend: {
      minWidth: {
        400: '400px'
      },
      maxWidth: {
        400: '400px',
        500: '500px',
        700: '700px',
        900: '900px'
      },
      width: {
        '30p': '30px',
        50: '12rem'
      },
      colors: {
        red: {
          100: '#fff5f5',
          200: '#fed7d7',
          300: '#feb2b2',
          400: '#fc8181',
          500: '#f56565',
          600: '#d22d40',
          700: '#c53030',
          800: '#9b2c2c',
          900: '#742a2a'
        },
        blue: {
          100: '#F7FAFF',
          300: '#4F7795',
          500: '#144593'
        },
        green: {
          50: '#C6FFEA',
          100: '#95EBCC'
        }
      }
    },
    screens: {
      md: { max: '1230px' }
    },
    fontFamily: {
      body: ['Open Sans', 'Sans-Serif'],
      display: ['Roboto', 'Sans-Serif']
    }
  },
  variants: {
    backgroundColor: ['even', 'hover', 'focus'],
    borderRadius: ['last', 'hover']
  },
  plugins: [],
  prefix: 'tw-'
}
