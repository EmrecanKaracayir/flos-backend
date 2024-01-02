import { IMyFixturesProvider } from "../providers/IMyFixturesProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IMyFixtures$Res } from "../schemas/responses/routes/my/fixtures/$fixtureId/IFixtures$Res";
import { IMyFixturesRes } from "../schemas/responses/routes/my/fixtures/IFixturesRes";

export interface IMyFixturesService {
  readonly myFixturesProvider: IMyFixturesProvider;

  getMyFixtures: (
    organizerId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyFixturesRes[]>>;

  getMyFixtures$: (
    organizerId: number,
    fixtureId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyFixtures$Res | null>>;

  putMyFixtures$Simulate: (
    organizerId: number,
    fixtureId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyFixtures$Res | null>>;
}
