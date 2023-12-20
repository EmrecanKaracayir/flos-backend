import { Pool } from "pg";

export const pool: Pool = new Pool({
  user: "Emrecan",
  host: "rds-pg-flos.czggso0ksewe.eu-central-1.rds.amazonaws.com",
  database: "flos",
  password: "password",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});
