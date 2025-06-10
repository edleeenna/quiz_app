import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cyber theme colors
				cyan: {
					400: 'rgb(34, 211, 238)',
					500: 'rgb(6, 182, 212)',
					600: 'rgb(8, 145, 178)',
				},
				magenta: {
					400: 'rgb(232, 121, 249)',
					500: 'rgb(217, 70, 239)',
					600: 'rgb(192, 38, 211)',
				},
				neon: {
					cyan: 'rgb(0, 255, 255)',
					magenta: 'rgb(255, 0, 255)',
					green: 'rgb(0, 255, 127)',
					orange: 'rgb(255, 165, 0)',
					purple: 'rgb(138, 43, 226)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'cyber-fade': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(30px) scale(0.95)',
						filter: 'blur(5px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0) scale(1)',
						filter: 'blur(0)'
					},
				},
				'cyber-slide': {
					'0%': { 
						opacity: '0',
						transform: 'translateX(-50px) rotateY(-10deg)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateX(0) rotateY(0)'
					},
				},
				'cyber-scale': {
					'0%': { 
						opacity: '0',
						transform: 'scale(0.8) rotateX(10deg)'
					},
					'100%': { 
						opacity: '1',
						transform: 'scale(1) rotateX(0)'
					},
				},
				'float-cyber': {
					'0%, 100%': {
						transform: 'translateY(0px) rotateZ(0deg)'
					},
					'50%': {
						transform: 'translateY(-15px) rotateZ(1deg)'
					},
				},
				'glow-pulse': {
					'0%': {
						boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.2)'
					},
					'100%': {
						boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.4)'
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'cyber-fade': 'cyber-fade 1s ease-out forwards',
				'cyber-slide': 'cyber-slide 1s ease-out forwards',
				'cyber-scale': 'cyber-scale 0.8s ease-out forwards',
				'float-cyber': 'float-cyber 4s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate'
			},
			fontFamily: {
				sans: ['Rajdhani', 'sans-serif'],
				display: ['Orbitron', 'monospace'],
				tech: ['Rajdhani', 'sans-serif'],
			},
			backgroundImage: {
				'cyber-grid': 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
				'matrix-pattern': 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)',
			},
			backgroundSize: {
				'cyber': '100px 100px',
				'matrix': '20px 20px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;