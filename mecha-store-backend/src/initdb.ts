import db from "./db";

db.serialize(() => {
  // Eliminar tablas viejas si existen para hacer una recreación limpia
  db.run(`DROP TABLE IF EXISTS order_items`);
  db.run(`DROP TABLE IF EXISTS orders`);
  db.run(`DROP TABLE IF EXISTS favorites`);
  db.run(`DROP TABLE IF EXISTS heroes`);
  db.run(`DROP TABLE IF EXISTS mechas`);
  db.run(`DROP TABLE IF EXISTS users`);

  // Tabla de usuarios
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  )`);

  // Tabla de mechas (figuras de acción coleccionables)
  db.run(`CREATE TABLE IF NOT EXISTS mechas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    poder TEXT NOT NULL,
    fortaleza TEXT NOT NULL,
    resistencia TEXT NOT NULL,
    debilidad TEXT NOT NULL,
    imagen_url TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL
  )`);

  // Tabla de favoritos para mechas
  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER NOT NULL,
    hero_id INTEGER NOT NULL, -- lo dejamos como hero_id en la BD por retrocompatibilidad con las peticiones N:M del front
    PRIMARY KEY(user_id, hero_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(hero_id) REFERENCES mechas(id) ON DELETE CASCADE
  )`);

  // Tabla de pedidos
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Tabla de detalles del pedido
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    mecha_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(mecha_id) REFERENCES mechas(id) ON DELETE CASCADE
  )`);

  console.log("🌱 Insertando mechas semilla con precios y existencias...");
  const stmt = db.prepare(`
    INSERT INTO mechas (nombre, poder, fortaleza, resistencia, debilidad, imagen_url, precio, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedMechas = [
    [
      "Gipsy Danger Mark-3",
      "Turbina Nuclear / Espada de Cadena GD-12",
      "Combate cuerpo a cuerpo y gran blindaje de titanio",
      "Resistencia a impactos masivos",
      "Vulnerable a pulsos electromagnéticos directos",
      "gipsy_danger.png",
      189.99,
      15
    ],
    [
      "Striker Eureka Mark-5",
      "Lanzador de misiles anti-kaiju / Hojas térmicas Sting-blades",
      "Velocidad extrema en combate y agilidad táctica",
      "Alta maniobrabilidad",
      "Daño mecánico en articulaciones hidráulicas inferiores",
      "striker_eureka.png",
      219.50,
      8
    ],
    [
      "Crimson Typhoon Mark-4",
      "Tres brazos de combate / Sierras giratorias IB-22",
      "Combate multidireccional y flexibilidad de tres pilotos",
      "Alta rotación de torso",
      "Blindaje ligero en la cabina expuesta de control",
      "crimson_typhoon.png",
      175.00,
      12
    ],
    [
      "Cherno Alpha Mark-1",
      "Puños electrificados Tesla / Reactor térmico M.B.R.",
      "Fuerza bruta descomunal y resistencia colosal",
      "Armadura pesada de acero",
      "Extremadamente lento y baja agilidad frente a ataques rápidos",
      "cherno_alpha.png",
      199.99,
      5
    ]
  ];

  for (const mecha of seedMechas) {
    stmt.run(mecha);
  }
  stmt.finalize(() => {
    console.log("✅ Mechas semilla insertados correctamente.");
  });
});

console.log("✅ Estructura de base de datos de E-Commerce creada correctamente.");
