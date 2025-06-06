/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'shield': {
          'bg': '#FFFFFF', // Pure white background
          'accent': '#F0F7F4', // Very light mint green
          'accent-dark': '#E3EFE9', // Slightly darker mint for hover states
          'text': '#1A1A1A', // Near black for primary text
          'text-light': '#4A4A4A', // Dark gray for secondary text
          'border': '#E5E7EB', // Light gray for borders
          'primary': '#2E7D32', // Forest green for primary actions
          'primary-light': '#4CAF50', // Lighter green for hover states
          'secondary': '#6B7280', // Gray for secondary elements
          'success': '#10B981', // Emerald green for success states
          'warning': '#F59E0B', // Amber for warnings
          'error': '#EF4444', // Red for errors
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 