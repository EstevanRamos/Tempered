import { fontFamily } from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
	// Kept as `class` (never `media`) on purpose: the app ships `dark:` utilities but no dark
	// token set and never adds the class, so `media` would flip them on for every visitor whose
	// OS is in dark mode. The `dark` safelist entry is gone — nothing needs it emitted.
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			mobiles: '322px',
			mobilem: '376px',
			mobilel: '520px',
			laptop: '1075px',
			laptopl: '1439px',
			tablet: '765px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			// `theme.screens` replaces Tailwind's defaults, so `2xl:` emitted nothing until now
			// (breadcrumb.svelte relies on it, and container.screens below already assumes it).
			'2xl': '1536px'
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			sans: ['var(--font-body)', ...fontFamily.sans],
			serif: ['var(--font-heading)', ...fontFamily.serif]
		},
		extend: {
			spacing: {
				page: '8px'
			},
			borderColor: {
				DEFAULT: 'hsl(var(--border) / <alpha-value>)'
			},
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				success: {
					DEFAULT: 'hsl(var(--success) / <alpha-value>)',
					foreground: 'hsl(var(--success-foreground) / <alpha-value>)'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
					foreground: 'hsl(var(--warning-foreground) / <alpha-value>)'
				},
				// Additive. `primary-hover` gives the hover step a token instead of
				// `hover:bg-primary/90`, which blends the button into whatever is behind it;
				// `border-strong` is the >=3:1 control boundary that `border` is too quiet to be.
				'primary-hover': 'hsl(var(--primary-hover) / <alpha-value>)',
				'border-strong': 'hsl(var(--border-strong) / <alpha-value>)',
				// Tempered's `ink-faint`: placeholders, disabled labels, legal. Only the default theme
				// declares it; elsewhere it falls back to the muted foreground.
				'faint-foreground': 'hsl(var(--faint-foreground, var(--muted-foreground)) / <alpha-value>)',
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
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
				}
			},
			// The whole radius scale is derived from the active theme's --radius, so a square
			// theme (wine / lime / noor declare `--radius: 0px`) stays square on cards, badges,
			// dialogs, selects, alerts and skeletons too — previously only `rounded-radius`
			// (buttons + inputs) read the token and everything else was fixed pixels.
			// max(0px, …) keeps the smaller steps legal when --radius is 0.
			borderRadius: {
				// --radius-step lets a square theme (the default, Tempered) keep rounded-xl square as well.
				xl: 'calc(var(--radius) + var(--radius-step, 4px))',
				lg: 'var(--radius)',
				md: 'max(0px, calc(var(--radius) - 2px))',
				sm: 'max(0px, calc(var(--radius) - 4px))',
				radius: 'var(--radius)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' }
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' }
				},
				shimmer: {
					'100%': { left: '100%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
				shimmer: 'shimmer 1s infinite'
			},
			boxShadow: {
				// `shadow-xs` is a Tailwind v4 name; on v3 it resolved to nothing, so all three
				// sticky headers (nav, LimeNav, NoorNav) rendered flat. Defining it here fixes
				// every call site at once. Value = v4's shadow-xs (== v3's shadow-sm).
				xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'z-1': '0 2px 4px rgba(0, 0, 0, 0.1)',
				'z-2': '0 4px 8px rgba(0, 0, 0, 0.1)',
				'z-10': '0 6px 12px rgba(0, 0, 0, 0.15)',
				// The design system's one shadow, for things that float (drawers, menus, dialogs).
				overlay: 'var(--shadow-overlay, 0 6px 12px rgba(0, 0, 0, 0.15))'
			},
			// Same story for `backdrop-blur-xs` (nav drawer scrim). v4 name, v3 engine.
			backdropBlur: {
				xs: '4px'
			},
			// Tempered's type scale (design/tokens.json → type). Size, leading, tracking and weight
			// travel together; pair `display-*`, `heading`, `title` and `quote` with `font-serif`.
			// `label` and `eyebrow` are always uppercase: add `uppercase` alongside.
			fontSize: {
				xxs: '10px',
				'display-xl': ['112px', { lineHeight: '104px', letterSpacing: '0.14em', fontWeight: '400' }],
				'display-l': ['64px', { lineHeight: '68px', letterSpacing: '0.1em', fontWeight: '400' }],
				heading: ['36px', { lineHeight: '42px', letterSpacing: '0.08em', fontWeight: '500' }],
				title: ['24px', { lineHeight: '30px', letterSpacing: '0.06em', fontWeight: '500' }],
				quote: ['24px', { lineHeight: '32px', fontWeight: '400' }],
				'body-l': ['17px', { lineHeight: '28px' }],
				body: ['15px', { lineHeight: '24px' }],
				small: ['13px', { lineHeight: '20px' }],
				label: ['12px', { lineHeight: '16px', letterSpacing: '0.18em', fontWeight: '500' }],
				eyebrow: ['11px', { lineHeight: '16px', letterSpacing: '0.32em', fontWeight: '500' }],
				price: ['14px', { lineHeight: '20px', letterSpacing: '0.04em' }]
			},
			// Body copy line length (design/tokens.json → layout.measure).
			maxWidth: {
				measure: 'var(--measure, 56ch)'
			},
			// One named z-index scale, backed by the --z-* properties in src/app.css so the
			// call sites a utility cannot reach — inline styles and component <style> blocks —
			// read the same numbers as `z-modal` and friends instead of bidding with arbitrary
			// values from 60 to 1,000,000,000.
			zIndex: {
				sticky: 'var(--z-sticky)',
				overlay: 'var(--z-overlay)',
				drawer: 'var(--z-drawer)',
				modal: 'var(--z-modal)',
				popover: 'var(--z-popover)',
				toast: 'var(--z-toast)',
				skip: 'var(--z-skip)'
			},
			// `duration-fast` for feedback (120-180ms), `duration-panel` for panels
			// (180-240ms), `ease-standard` for both.
			transitionDuration: {
				fast: 'var(--motion-fast)',
				panel: 'var(--motion-panel)'
			},
			transitionTimingFunction: {
				standard: 'var(--motion-ease)'
			}
		}
	},
	plugins: [tailwindcssAnimate, require('tailwind-scrollbar'), require('@tailwindcss/typography')]
}

export default config
