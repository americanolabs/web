/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	darkMode: ['class'],
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: [
				'var(--font-main)'
			],
			serif: [
				'Garamond',
				'serif'
			],
			mono: [
				'Courier New',
				'monospace'
			]
		},
		screens: {
			all: '1px',
			xs: '480px',
			...defaultTheme.screens
		},
		extend: {
			colors: {
				black: '#010101',
				white: '#ffffff',
				gray: {
					'150': '#EBEDF0',
					'250': '#404040',
					'350': '#6B6B6B',
					...defaultTheme.colors.gray
				},
				primary: {
					'50': '#E6EDF9',
					'100': '#CDDCF4',
					'200': '#A7C2EC',
					'300': '#e6e6e6',
					'400': '#5385D2',
					'500': '#2764c1',
					'600': '#1D4685',
					'700': '#162A4A',
					'800': '#11213B',
					'900': '#0D192C',
					'1000': '#959595',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					'100': '#fff1e5',
					'200': '#f7a35f',
					'300': '#ffe8d4',
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					'50': '#FAEAF8',
					'100': '#F2C1EA',
					'200': '#EA98DC',
					'300': '#E26ECE',
					'400': '#DA45C0',
					'500': '#f7a35f',
					'600': '#e8995a',
					'700': '#fb5247',
					'800': '#6B185C',
					'900': '#400E37',
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				red: {
					'100': '#EBBAB8',
					'200': '#DF8D8A',
					'300': '#D25F5B',
					'400': '#C5312C',
					'500': '#BF1B15',
					'600': '#AB1812',
					'700': '#85120E',
					'800': '#5F0D0A',
					'900': '#390806'
				},
				green: {
					'50': '#D3E3DB',
					'100': '#BED5C9',
					'200': '#93BAA6',
					'300': '#679F82',
					'400': '#3C835E',
					'500': '#27764d',
					'600': '#236A45',
					'700': '#1F5E3D',
					'800': '#17462E',
					'900': '#0F2F1E'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontSize: {
				xxs: '0.7rem',
				xs: '0.775rem',
				sm: '0.85rem',
				md: '0.95rem'
			},
			spacing: {
				'88': '22rem',
				'100': '26rem',
				'112': '28rem',
				'128': '32rem',
				'144': '36rem'
			},
			borderRadius: {
				none: '0',
				sm: 'calc(var(--radius) - 4px)',
				DEFAULT: '0.30rem',
				md: 'calc(var(--radius) - 2px)',
				lg: 'var(--radius)',
				full: '9999px'
			},
			blur: {
				xs: '3px'
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
			},
			transitionProperty: {
				height: 'height, max-height',
				spacing: 'margin, padding'
			},
			maxWidth: {
				'xl-1': '39.5rem',
				'95vw': '95vw'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
