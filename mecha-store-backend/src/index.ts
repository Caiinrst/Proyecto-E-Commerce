import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mechasRouter from "./routes/mechas";
import usersRouter from "./routes/users";
import ordersRouter from "./routes/orders";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", usersRouter);
app.use("/api/mechas", mechasRouter);
app.use("/api/orders", ordersRouter);

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Error no controlado:", err.stack || err.message);
  res.status(500).json({ error: "Ocurrió un error en el servidor" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
