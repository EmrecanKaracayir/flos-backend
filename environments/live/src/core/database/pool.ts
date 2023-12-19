import { Pool } from "pg";

export const pool: Pool = new Pool({
  user: "postgres",
  host: "test",
  database: "flos",
  password: "postgres",
  port: 5432,
});
