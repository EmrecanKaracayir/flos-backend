import express, { Express } from "express";
import { router as authRouter } from "./routes/Auth";
import { API_PREFIX } from "./utils/constants";

const app: Express = express();
const port: number = 3000;

// Routers
app.use(`${API_PREFIX}/auth`, authRouter);

app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
