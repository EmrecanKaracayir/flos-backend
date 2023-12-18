import { ILeagueModel } from "../models/ILeagueModel";

export interface ILeaguesProvider {
  getLeagueModels: () => Promise<ILeagueModel[]>;

  getLeagueModelById: (leagueId: number) => Promise<ILeagueModel | null>;
}

export enum LeaguesQueries {
  GET_LEAGUE_MODELS = `SELECT "League"."leagueId", "League".name, "League".state, "League".prize, "Organizer".email AS "organizerEmail", "League".description, "League"."logoPath"  FROM "League" INNER JOIN "Organizer" ON "League"."organizerId" = "Organizer"."organizerId"`,
  GET_LEAGUE_MODEL_BY_$ID = `${GET_LEAGUE_MODELS} WHERE "leagueId" = $1`,
}
