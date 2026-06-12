import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecret";

// Registro de usuario
router.post("/register", (req, res) => {
  const { nombre, email, password, role } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos (nombre, email, password) son obligatorios" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userRole = role || "user";

  db.run(
    "INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)",
    [nombre, email, hashedPassword, userRole],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "El email o nombre de usuario ya está registrado" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: "Usuario registrado correctamente" });
    }
  );
});

// Login de usuario
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, nombre: user.nombre, email: user.email }, SECRET, { expiresIn: "1h" });
    
    // Return token and nombre as expected by the frontend
    res.json({ token, nombre: user.nombre });
  });
});

// Actualizar perfil de usuario logueado (nombre, email, password)
router.put("/update", authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const { nombre, email, password } = req.body;

  if (!nombre && !email && !password) {
    return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
  }

  // Si se actualizan campos, construimos el query dinámicamente
  const fieldsToUpdate: string[] = [];
  const params: any[] = [];

  if (nombre) {
    fieldsToUpdate.push("nombre = ?");
    params.push(nombre);
  }
  if (email) {
    fieldsToUpdate.push("email = ?");
    params.push(email);
  }
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    fieldsToUpdate.push("password = ?");
    params.push(hashedPassword);
  }

  // Agregar el ID del usuario al final de los parámetros
  params.push(userId);

  const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

  db.run(query, params, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "El email o nombre de usuario ya está en uso" });
      }
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Perfil actualizado correctamente" });
  });
});

export default router;
