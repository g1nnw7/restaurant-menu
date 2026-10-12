/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                // paleta "mar + brasa": azul-petróleo profundo (o mar/a noite do food park)
                // contrastando com o coral-camarão (o prato, o fogo da chapa)
                mare: {
                    950: "#0a2530",
                    900: "#0f3140",
                    800: "#153f52",
                    700: "#1d5268",
                },
                brasa: {
                    400: "#ff9466",
                    500: "#f5734a",
                    600: "#e2582f",
                    700: "#bd4323",
                },
                areia: {
                    50: "#fbf6ee",
                    100: "#f4ead6",
                    200: "#e9d9bb",
                },
            },
            fontFamily: {
                display: ["'Fraunces'", "serif"],
                body: ["'Work Sans'", "sans-serif"],
            },
            boxShadow: {
                casco: "0 18px 40px -18px rgba(10, 37, 48, 0.55)",
            },
        },
    },
    plugins: [],
};
