import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs"; // Importar o módulo fs
import bodyParser from "body-parser"; // Para parsear o corpo da requisição

export default defineConfig({
  plugins: [
    react(),
    {
      name: "custom-api-plugin",
      configureServer(server) {
        // Middleware para parsear JSON no corpo da requisição
        server.middlewares.use(bodyParser.json());

        server.middlewares.use("/api/update-products", (req, res, next) => {
          if (req.method === "POST") {
            const productsData = req;
            const filePath = path.resolve(__dirname, "public/products.json");

            try {
              fs.writeFileSync(filePath, JSON.stringify(productsData, null, 2), "utf-8");
              res.statusCode = 200;
              res.end(JSON.stringify({ message: "Produtos atualizados com sucesso!" }));
            } catch (error) {
              console.error("Erro ao salvar produtos:", error);
              res.statusCode = 500;
              res.end(JSON.stringify({ message: "Erro ao salvar produtos.", error: (error as Error).message }));
            }
          } else {
            next();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

