import express, { Router } from "express";

export const router: Router = express.Router();

router.get("/", (_, res) => {
  res.send("Hello World!");
});

router.post("/");
