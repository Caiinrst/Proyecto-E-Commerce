import express from "express";
import db from "../db";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Realizar una compra (Checkout)
router.post("/", authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const { items } = req.body; // Array de { mechaId, cantidad }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "El pedido debe contener al menos un artículo" });
  }

  // Realizamos las consultas de forma secuencial en una transacción
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const mechaIds = items.map(i => i.mechaId);
    const placeholders = mechaIds.map(() => "?").join(",");

    db.all(
      `SELECT id, nombre, precio, stock FROM mechas WHERE id IN (${placeholders})`,
      mechaIds,
      (err, mechasInDb: any[]) => {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }

        const mechasMap = new Map<number, any>();
        mechasInDb.forEach(m => mechasMap.set(m.id, m));

        let total = 0;
        const itemsToInsert: { mechaId: number, cantidad: number, precioUnitario: number }[] = [];

        // Validar existencias
        for (const item of items) {
          const mecha = mechasMap.get(item.mechaId);
          if (!mecha) {
            db.run("ROLLBACK");
            return res.status(404).json({ error: `Figura de Mecha con ID ${item.mechaId} no encontrada` });
          }

          if (mecha.stock < item.cantidad) {
            db.run("ROLLBACK");
            return res.status(400).json({ 
              error: `Stock insuficiente para la figura '${mecha.nombre}'. Disponibles: ${mecha.stock}, Solicitado: ${item.cantidad}` 
            });
          }

          total += mecha.precio * item.cantidad;
          itemsToInsert.push({
            mechaId: item.mechaId,
            cantidad: item.cantidad,
            precioUnitario: mecha.precio
          });
        }

        // Insertar orden
        db.run(
          "INSERT INTO orders (user_id, total) VALUES (?, ?)",
          [userId, total],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }

            const orderId = this.lastID;
            let errorOccurred = false;
            let completedCount = 0;

            for (const item of itemsToInsert) {
              // Insertar detalle del pedido
              db.run(
                "INSERT INTO order_items (order_id, mecha_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
                [orderId, item.mechaId, item.cantidad, item.precioUnitario],
                (err) => {
                  if (err) errorOccurred = true;
                }
              );

              // Actualizar existencias
              db.run(
                "UPDATE mechas SET stock = stock - ? WHERE id = ?",
                [item.cantidad, item.mechaId],
                (err) => {
                  if (err) errorOccurred = true;

                  completedCount++;
                  if (completedCount === itemsToInsert.length) {
                    if (errorOccurred) {
                      db.run("ROLLBACK");
                      return res.status(500).json({ error: "Error al actualizar existencias o registrar pedido" });
                    } else {
                      db.run("COMMIT");
                      return res.json({ message: "Compra realizada con éxito", orderId, total });
                    }
                  }
                }
              );
            }
          }
        );
      }
    );
  });
});

// Obtener historial de pedidos del usuario logueado
router.get("/", authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const query = `
    SELECT o.id as order_id, o.total, o.created_at, 
           oi.mecha_id, oi.cantidad, oi.precio_unitario,
           m.nombre as mecha_nombre, m.imagen_url as mecha_imagen
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN mechas m ON oi.mecha_id = m.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.all(query, [userId], (err, rows: any[]) => {
    if (err) return res.status(500).json({ error: err.message });

    const ordersMap = new Map<number, any>();
    rows.forEach(row => {
      if (!row.order_id) return;
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          id: row.order_id,
          total: row.total,
          created_at: row.created_at,
          items: []
        });
      }
      if (row.mecha_id) {
        ordersMap.get(row.order_id).items.push({
          mechaId: row.mecha_id,
          nombre: row.mecha_nombre,
          imagen_url: row.mecha_imagen,
          cantidad: row.cantidad,
          precioUnitario: row.precio_unitario
        });
      }
    });

    res.json(Array.from(ordersMap.values()));
  });
});

export default router;
