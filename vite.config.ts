import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({command}) => ({
    plugins: [
        react(),
        tailwindcss()
    ],
    publicDir: command === "build" ? false : "public" // Handled in package.json to avoid copying /data folder
}))
