import { ISearchModel } from "../interfaces/models/ISearchModel";
import { ISearchProvider } from "../interfaces/providers/ISearchProvider";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import { IClientError } from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { ISearchResData } from "../interfaces/schemas/responses/routes/search/ISearchResData";
import { ISearchService } from "../interfaces/services/ISearchService";
import { SearchProvider } from "../providers/SearchProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { SearchResData } from "../schemas/responses/routes/search/SearchResData";

export class SearchService implements ISearchService {
  public readonly searchProvider: ISearchProvider;

  constructor() {
    this.searchProvider = new SearchProvider();
  }

  public async getSearch_(
    query: string,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ISearchResData>> {
    const model: ISearchModel = await this.searchProvider.getSearchModel(query);
    return new GenericResponse<ISearchResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      SearchResData.fromModel(model),
      null,
    );
  }
}
