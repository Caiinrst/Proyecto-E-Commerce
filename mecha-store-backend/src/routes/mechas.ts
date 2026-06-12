import express from "express";
import jwt from "jsonwebtoken";
import db from "../db";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecret";

// Obtener catálogo de mechas (Autenticación opcional para marcar esFavorito)
router.get("/catalog", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let userId: number | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET) as any;
      userId = decoded.id;
    } catch (err) {
      // Ignorar token inválido
    }
  }

  if (userId) {
    const query = `
      SELECT m.*, 
             CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as esFavorito
      FROM mechas m
      LEFT JOIN favorites f ON m.id = f.hero_id AND f.user_id = ?
    `;
    db.all(query, [userId], (err, rows: any[]) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const processedRows = rows.map(row => ({
        ...row,
        esFavorito: !!row.esFavorito
      }));
      res.json(processedRows);
    });
  } else {
    db.all("SELECT *, 0 as esFavorito FROM mechas", [], (err, rows: any[]) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const processedRows = rows.map(row => ({
        ...row,
        esFavorito: false
      }));
      res.json(processedRows);
    });
  }
});

// Obtener mechas favoritos del usuario logueado
router.get("/favorites", authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const query = `
    SELECT m.* 
    FROM mechas m
    INNER JOIN favorites f ON m.id = f.hero_id
    WHERE f.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Añadir un mecha a favoritos
router.post("/favorites", authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const heroId = req.body.heroId || req.body.heroeId;

  if (!heroId) {
    return res.status(400).json({ error: "El ID del mecha (heroId o heroeId) es obligatorio" });
  }

  db.get(
    "SELECT * FROM favorites WHERE user_id = ? AND hero_id = ?",
    [userId, heroId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) {
        return res.status(400).json({ error: "El mecha ya está en tus favoritos" });
      }

      db.run(
        "INSERT INTO favorites (user_id, hero_id) VALUES (?, ?)",
        [userId, heroId],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Mecha añadido a favoritos correctamente" });
        }
      );
    }
  );
});

// Eliminar un mecha de favoritos
router.delete("/favorites/:heroId", authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const { heroId } = req.params;

  db.run(
    "DELETE FROM favorites WHERE user_id = ? AND hero_id = ?",
    [userId, heroId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Mecha eliminado de favoritos correctamente" });
    }
  );
});

// Crear un nuevo mecha
router.post("/", authenticateToken, (req, res) => {
  const { nombre, poder, fortaleza, resistencia, debilidad, imagen_url, precio, stock } = req.body;

  if (!nombre || !poder || !fortaleza || !resistencia || !debilidad || !imagen_url || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: "Todos los campos de la figura de mecha son obligatorios" });
  }

  db.run(
    `INSERT INTO mechas (nombre, poder, fortaleza, resistencia, debilidad, imagen_url, precio, stock) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, poder, fortaleza, resistencia, debilidad, imagen_url, Number(precio), Number(stock)],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Figura de Mecha creada correctamente" });
    }
  );
});

// Actualizar un mecha
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { nombre, poder, fortaleza, resistencia, debilidad, imagen_url, precio, stock } = req.body;

  if (!nombre || !poder || !fortaleza || !resistencia || !debilidad || !imagen_url || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: "Todos los campos de la figura de mecha son obligatorios" });
  }

  db.run(
    `UPDATE mechas 
     SET nombre = ?, poder = ?, fortaleza = ?, resistencia = ?, debilidad = ?, imagen_url = ?, precio = ?, stock = ? 
     WHERE id = ?`,
    [nombre, poder, fortaleza, resistencia, debilidad, imagen_url, Number(precio), Number(stock), id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Mecha no encontrado" });
      res.json({ message: "Figura de Mecha actualizada correctamente" });
    }
  );
});

// Eliminar un mecha
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM mechas WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Mecha no encontrado" });
    res.json({ message: "Figura de Mecha eliminada correctamente" });
  });
});

export default router;
