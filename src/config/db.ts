import { Pool } from "pg";

const pool: Pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "flos",
  password: "password",
  port: 5432,
});

export default pool;
