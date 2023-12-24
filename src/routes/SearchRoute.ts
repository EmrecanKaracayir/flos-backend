import { Router } from "express";
import { SearchController } from "../controllers/SearchController";
import { ISearchController } from "../interfaces/controllers/ISearchController";
import { IRoute } from "../interfaces/routes/IRoute";

export class SearchRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "search";
  private readonly searchController: ISearchController;

  constructor() {
    this.router = Router();
    this.searchController = new SearchController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.searchController.getSearch_.bind(this.searchController),
    );
  }
}
