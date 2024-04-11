import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // haceme un proxy de todas las peticiones del cliente que comiencen con /api al servidor (api)
      "/api": {
        ///url del servidor
        target: "http://localhost:3000/",
        //quiero que sea solo http
        secure: false,
      },
    },
  },
  plugins: [react()],
});
