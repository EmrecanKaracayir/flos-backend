import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IFixtureModel } from "../interfaces/models/IFixtureModel";
import {
  FixturesQueries,
  IFixturesProvider,
} from "../interfaces/providers/IFixturesProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { FixtureModel } from "../models/FixtureModel";

export class FixturesProvider implements IFixturesProvider {
  public async getFixtures(): Promise<IFixtureModel[]> {
    const fixtureRes: QueryResult = await pool.query(
      FixturesQueries.GET_FIXTURES,
    );
    const fixtureRecs: unknown[] = fixtureRes.rows;
    if (!fixtureRecs) {
      return [];
    }
    if (!FixtureModel.areValidModels(fixtureRecs)) {
      throw new ModelMismatchError(fixtureRecs);
    }
    return fixtureRecs as IFixtureModel[];
  }

  public async getFixture(fixtureId: number): Promise<IFixtureModel | null> {
    const fixtureRes: QueryResult = await pool.query(
      FixturesQueries.GET_FIXTURE_$FXID,
      [fixtureId],
    );
    const fixtureRecs: unknown = fixtureRes.rows[0];
    if (!fixtureRecs) {
      return null;
    }
    if (!FixtureModel.isValidModel(fixtureRecs)) {
      throw new ModelMismatchError(fixtureRecs);
    }
    return fixtureRecs as IFixtureModel;
  }
}
