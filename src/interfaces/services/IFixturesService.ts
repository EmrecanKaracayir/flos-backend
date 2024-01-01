import { IFixturesProvider } from "../providers/IFixturesProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IFixtures$Res } from "../schemas/responses/routes/fixtures/$fixtureId/IFixtures$Res";
import { IFixturesRes } from "../schemas/responses/routes/fixtures/IFixturesRes";

export interface IFixturesService {
  readonly fixturesProvider: IFixturesProvider;

  getFixtures: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IFixturesRes[]>>;

  getFixtures$: (
    fixtureId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IFixtures$Res | null>>;
}
