import { ISearchProvider } from "../providers/ISearchProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { ISearchRes } from "../schemas/responses/routes/search/ISearchRes";

export interface ISearchService {
  readonly searchProvider: ISearchProvider;

  getSearch_: (
    query: string,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<ISearchRes>>;
}
