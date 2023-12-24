import { Router } from "express";
import { PlayersController } from "../controllers/PlayersController";
import { IPlayersController } from "../interfaces/controllers/IPlayersController";
import { IRoute } from "../interfaces/routes/IRoute";

export class PlayersRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "players";
  private readonly playersController: IPlayersController;

  constructor() {
    this.router = Router();
    this.playersController = new PlayersController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.playersController.getPlayers.bind(this.playersController),
    );
    this.router.get(
      "/:playerId",
      this.playersController.getPlayers$playerId.bind(this.playersController),
    );
  }
}
