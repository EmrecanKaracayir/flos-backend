import { IFixtureModel } from "../models/IFixtureModel";

export interface IFixturesProvider {
  getFixtures: () => Promise<IFixtureModel[]>;

  getFixture: (fixtureId: number) => Promise<IFixtureModel | null>;
}

export enum FixturesQueries {
  GET_FIXTURES = `SELECT * FROM "FixtureView"`,
  GET_FIXTURE_$FXID = `SELECT * FROM "FixtureView" WHERE "fixtureId" = $1`,
}
