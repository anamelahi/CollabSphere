import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Database connection error:", err));

export default db;
