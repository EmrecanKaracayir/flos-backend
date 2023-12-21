import { Router } from "express";
import { SearchController } from "../controllers/SearchController";
import { ISearchController } from "../interfaces/controllers/ISearchController";
import { IRoute } from "../interfaces/routes/IRoute";

export class SearchRoute implements IRoute {
  public readonly router: Router;
  private readonly path: string;
  private readonly searchController: ISearchController;

  constructor() {
    this.router = Router();
    this.path = "/search";
    this.searchController = new SearchController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      this.searchController.getSearch_.bind(this.searchController),
    );
  }
}
