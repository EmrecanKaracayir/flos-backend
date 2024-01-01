import { IFixtureModel } from "../interfaces/models/IFixtureModel";
import { IFixturesProvider } from "../interfaces/providers/IFixturesProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IFixtures$Res } from "../interfaces/schemas/responses/routes/fixtures/$fixtureId/IFixtures$Res";
import { IFixturesRes } from "../interfaces/schemas/responses/routes/fixtures/IFixturesRes";
import { IFixturesService } from "../interfaces/services/IFixturesService";
import { FixturesProvider } from "../providers/FixturesProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { Fixtures$Res } from "../schemas/responses/routes/fixtures/$fixtureId/Fixtures$Res";
import { FixturesRes } from "../schemas/responses/routes/fixtures/FixturesRes";

export class FixturesService implements IFixturesService {
  public readonly fixturesProvider: IFixturesProvider;

  constructor() {
    this.fixturesProvider = new FixturesProvider();
  }

  public async getFixtures(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IFixturesRes[]>> {
    const models: IFixtureModel[] = await this.fixturesProvider.getFixtures();
    return new AppResponse<IFixturesRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      FixturesRes.fromModels(models),
      null,
    );
  }

  public async getFixtures$(
    fixtureId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IFixtures$Res | null>> {
    const model: IFixtureModel | null =
      await this.fixturesProvider.getFixture(fixtureId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_FIXTURE_FOUND_IN_FIXTURES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IFixtures$Res>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      Fixtures$Res.fromModel(model),
      null,
    );
  }
}
