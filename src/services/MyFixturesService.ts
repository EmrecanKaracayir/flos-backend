import { IMyClubPlayerModel } from "../interfaces/models/IMyClubPlayerModel";
import { IMyFixtureModel } from "../interfaces/models/IMyFixtureModel";
import { IMyFixturesProvider } from "../interfaces/providers/IMyFixturesProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyFixtures$Res } from "../interfaces/schemas/responses/routes/my/fixtures/$fixtureId/IFixtures$Res";
import { IMyFixturesRes } from "../interfaces/schemas/responses/routes/my/fixtures/IFixturesRes";
import { IMyFixturesService } from "../interfaces/services/IMyFixturesService";
import { MyFixturesProvider } from "../providers/MyFixturesProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { MyFixtures$Res } from "../schemas/responses/routes/my/fixtures/$fixtureId/MyFixtures$Res";
import { MyFixturesRes } from "../schemas/responses/routes/my/fixtures/MyFixturesRes";

export class MyFixturesService implements IMyFixturesService {
  public readonly myFixturesProvider: IMyFixturesProvider;

  constructor() {
    this.myFixturesProvider = new MyFixturesProvider();
  }

  public async getMyFixtures(
    organizerId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyFixturesRes[]>> {
    const models: IMyFixtureModel[] =
      await this.myFixturesProvider.getMyFixtures(organizerId);
    return new AppResponse<IMyFixturesRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyFixturesRes.fromModels(models),
      null,
    );
  }
  public async getMyFixtures$(
    organizerId: number,
    fixtureId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyFixtures$Res | null>> {
    const model: IMyFixtureModel | null =
      await this.myFixturesProvider.getMyFixture(organizerId, fixtureId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_FIXTURE_FOUND_IN_MY_FIXTURES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IMyFixtures$Res>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyFixtures$Res.fromModel(model),
      null,
    );
  }

  public async putMyFixtures$Simulate(
    organizerId: number,
    fixtureId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyFixtures$Res | null>> {
    if (
      !(await this.myFixturesProvider.doesMyFixtureExist(
        organizerId,
        fixtureId,
      ))
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_FIXTURE_FOUND_IN_MY_FIXTURES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    // CHECKS
    if (!(await this.myFixturesProvider.isMyFixtureAvailable(fixtureId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.FIXTURE_ALREADY_SIMULATED),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const model: IMyFixtureModel | null =
      await this.myFixturesProvider.getMyFixture(organizerId, fixtureId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_FIXTURE_FOUND_IN_MY_FIXTURES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.simulateFixture(
      model,
      await this.myFixturesProvider.getMyClubPlayers(model.homeClubId),
      await this.myFixturesProvider.getMyClubPlayers(model.awayClubId),
    );
    const result: IMyFixtureModel | null =
      await this.myFixturesProvider.getMyFixture(organizerId, fixtureId);
    if (!result) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_FIXTURE_FOUND_IN_MY_FIXTURES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IMyFixtures$Res>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyFixtures$Res.fromModel(result),
      null,
    );
  }

  private async simulateFixture(
    fixture: IMyFixtureModel,
    homeClubPlayers: IMyClubPlayerModel[],
    awayClubPlayers: IMyClubPlayerModel[],
  ): Promise<void> {
    const homePerformances: Performance[] = [];
    const awayPerformances: Performance[] = [];
    // fill with empty performances
    for (let i: number = 0; i < homeClubPlayers.length; i++) {
      homePerformances.push({
        playerId: homeClubPlayers[i].playerId,
        goals: 0,
        assists: 0,
      });
    }
    for (let i: number = 0; i < awayClubPlayers.length; i++) {
      awayPerformances.push({
        playerId: awayClubPlayers[i].playerId,
        goals: 0,
        assists: 0,
      });
    }
    // pick a random number between 0 - 10
    const homeGoals: number = Math.floor(Math.random() * 11);
    const awayGoals: number = Math.floor(Math.random() * 11);
    // in a for loop for each goal scored assign who scored and who assisted
    for (let i: number = 0; i < homeGoals; i++) {
      // pick a random player from homeClubPlayers
      const randomPlayerIndex: number = Math.floor(
        Math.random() * homeClubPlayers.length,
      );
      homePerformances[randomPlayerIndex].goals++;
      // pick a random player from awayClubPlayers
      // shouldn't be same player as above
      const randomAssistIndex: number = Math.floor(
        Math.random() * homeClubPlayers.length,
      );
      awayPerformances[randomAssistIndex].assists++;
    }

    for (let i: number = 0; i < awayGoals; i++) {
      // pick a random player from awayClubPlayers
      const randomPlayerIndex: number = Math.floor(
        Math.random() * awayClubPlayers.length,
      );
      awayPerformances[randomPlayerIndex].goals++;
      // pick a random player from homeClubPlayers
      const randomAssistIndex: number = Math.floor(
        Math.random() * awayClubPlayers.length,
      );
      homePerformances[randomAssistIndex].assists++;
    }

    // update the fixture with the results
    await this.myFixturesProvider.updateFixture(
      fixture.fixtureId,
      homeGoals,
      awayGoals,
    );

    // update the performances
    for (let i: number = 0; i < homePerformances.length; i++) {
      if (
        homePerformances[i].goals !== 0 ||
        homePerformances[i].assists !== 0
      ) {
        await this.myFixturesProvider.addPerformance(
          homePerformances[i].playerId,
          fixture.fixtureId,
          homePerformances[i].goals,
          homePerformances[i].assists,
        );
      }
    }
    for (let i: number = 0; i < awayPerformances.length; i++) {
      if (
        awayPerformances[i].goals !== 0 ||
        awayPerformances[i].assists !== 0
      ) {
        await this.myFixturesProvider.addPerformance(
          awayPerformances[i].playerId,
          fixture.fixtureId,
          awayPerformances[i].goals,
          awayPerformances[i].assists,
        );
      }
    }

    // Update statistics
    await this.myFixturesProvider.updateStatistics(
      fixture.homeClubId,
      fixture.leagueId,
      homeGoals > awayGoals ? 1 : 0,
      homeGoals === awayGoals ? 1 : 0,
      homeGoals < awayGoals ? 1 : 0,
      homeGoals,
      awayGoals,
    );
    await this.myFixturesProvider.updateStatistics(
      fixture.awayClubId,
      fixture.leagueId,
      homeGoals < awayGoals ? 1 : 0,
      homeGoals === awayGoals ? 1 : 0,
      homeGoals > awayGoals ? 1 : 0,
      awayGoals,
      homeGoals,
    );

    // Check if last fixture of the season
    if (
      await this.myFixturesProvider.wasTheLastFixtureOfSeason(fixture.leagueId)
    ) {
      // finish league
      await this.myFixturesProvider.finishLeague(fixture.leagueId);
    }
  }
}

interface Performance {
  playerId: number;
  goals: number;
  assists: number;
}
