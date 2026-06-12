import sqlite3 from "sqlite3";
import { Database } from "sqlite3";

sqlite3.verbose();

const db: Database = new sqlite3.Database("./ecommerce.db", (err) => {
  if (err) {
    console.error("❌ Error al conectar con SQLite:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite (ecommerce.db)");
  }
});

export default db;
