/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#164E35', // Primary dark green
          800: '#1B6343',
          700: '#218653', // Primary green
          600: '#2BA667',
          500: '#3ABF7A',
          200: '#C2E8CE',
          100: '#E8F5DF', // Light green
          50: '#F4FAF0',
        },
        surface: {
          bg: '#F5F7F2',    // Apple-style soft tinted background
          card: '#FFFFFF',  // Pure card
          glass: 'rgba(255, 255, 255, 0.82)', // Apple HIG material
          border: 'rgba(0, 0, 0, 0.06)',      // Apple hairline border
          subtle: 'rgba(0, 0, 0, 0.03)',      // Apple subtle fill
          highlight: 'rgba(0, 0, 0, 0.05)',
        },
        ink: {
          primary: '#1A2920',   // High contrast primary
          secondary: '#68776D', // Apple system secondary gray
          muted: '#8E9D93',     // Apple tertiary label
        },
        harvest: {
          DEFAULT: '#F4A340', // Accent orange / gold
          hover: '#E3922E',
          light: '#FEF3E2',
        },
        mandi: {
          blue: '#007AFF',    // Apple System Blue
          red: '#FF3B30',     // Apple System Red
          green: '#34C759',   // Apple System Green
          yellow: '#FF9500',  // Apple System Amber
        }
      },
      fontFamily: {
        sans: [
          'Poppins',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          '"Noto Sans Devanagari"',
          'system-ui',
          'sans-serif'
        ],
        display: [
          'Poppins',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        hindi: [
          '"Noto Sans Devanagari"',
          'Poppins',
          'sans-serif'
        ]
      },
      borderRadius: {
        'squircle-sm': '10px',
        'squircle': '16px',
        'squircle-lg': '22px',
        'squircle-xl': '28px',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 2px 14px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.08)',
        'apple-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.12)',
        'apple-modal': '0 24px 60px -12px rgba(0, 0, 0, 0.18), 0 0 1px rgba(0, 0, 0, 0.15)',
        'apple-dock': '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
