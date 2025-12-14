/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./**/*.tsx"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: '#6366f1', // Indigo 500
                secondary: '#a855f7', // Purple 500
                accent: '#ec4899', // Pink 500
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
            },
            animation: {
                'bounce-short': 'bounce 0.5s ease-in-out 1',
                'fade-in': 'fadeIn 0.5s ease-out',
                'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pop: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
