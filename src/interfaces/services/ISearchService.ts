import { ISearchProvider } from "../providers/ISearchProvider";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { ISearchResData } from "../schemas/responses/routes/search/ISearchResData";

export interface ISearchService {
  readonly searchProvider: ISearchProvider;

  getSearch_: (
    query: string,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ISearchResData>>;
}
