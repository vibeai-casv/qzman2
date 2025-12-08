/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: "hsl(var(--card))",
                "card-foreground": "hsl(var(--card-foreground))",
                popover: "hsl(var(--popover))",
                "popover-foreground": "hsl(var(--popover-foreground))",
                primary: "hsl(var(--primary))",
                "primary-foreground": "hsl(var(--primary-foreground))",
                secondary: "hsl(var(--secondary))",
                "secondary-foreground": "hsl(var(--secondary-foreground))",
                muted: "hsl(var(--muted))",
                "muted-foreground": "hsl(var(--muted-foreground))",
                accent: "hsl(var(--accent))",
                "accent-foreground": "hsl(var(--accent-foreground))",
                destructive: "hsl(var(--destructive))",
                "destructive-foreground": "hsl(var(--destructive-foreground))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
                // QZMAN Design System Colors
                'qz-primary': '#4361ee',
                'qz-secondary': '#3a0ca3',
                'qz-accent': '#f72585',
                'qz-success': '#4cc9f0',
                'qz-warning': '#f8961e',
                'qz-danger': '#f94144'
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'slide-in': 'slideIn 0.5s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'buzzer-glow': 'buzzerGlow 0.5s infinite',
                'score-increase': 'score-increase 0.5s ease',
            },
            keyframes: {
                slideIn: {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                buzzerGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px #f72585' },
                    '50%': { boxShadow: '0 0 40px #f72585' },
                },
                'score-increase': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)', color: '#10b981' },
                    '100%': { transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
