import { IMyLeaguesReqDto } from "../../../../../interfaces/schemas/requests/routes/my/leagues/IMyLeaguesReqDto";

export class MyLeaguesReqDto implements IMyLeaguesReqDto {
  constructor(
    public readonly name: string,
    public readonly prize: number,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidDto(obj: unknown): obj is IMyLeaguesReqDto {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const dto: IMyLeaguesReqDto = obj as IMyLeaguesReqDto;
    return (
      typeof dto.name === "string" &&
      typeof dto.prize === "number" &&
      typeof dto.description === "string" &&
      typeof dto.logoPath === "string"
    );
  }
}
