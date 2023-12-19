import { Pool } from "pg";

export const pool: Pool = new Pool({
  user: "Emrecan",
  host: "localhost",
  database: "flos",
  password: "password",
  port: 5432,
});
