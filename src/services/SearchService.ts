import { ISearchModel } from "../interfaces/models/ISearchModel";
import { ISearchProvider } from "../interfaces/providers/ISearchProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import { IClientError } from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { ISearchRes } from "../interfaces/schemas/responses/routes/search/ISearchRes";
import { ISearchService } from "../interfaces/services/ISearchService";
import { SearchProvider } from "../providers/SearchProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { SearchRes } from "../schemas/responses/routes/search/SearchRes";

export class SearchService implements ISearchService {
  public readonly searchProvider: ISearchProvider;

  constructor() {
    this.searchProvider = new SearchProvider();
  }

  public async getSearch_(
    query: string,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<ISearchRes>> {
    const model: ISearchModel =
      await this.searchProvider.getSearchResults(query);
    return new AppResponse<ISearchRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      SearchRes.fromModel(model),
      null,
    );
  }
}
