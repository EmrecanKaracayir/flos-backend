import { IMyClubReqDto } from "../../../../../interfaces/schemas/requests/routes/my/club/IMyClubReqDto";

export class MyClubReqDto implements IMyClubReqDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidDto(obj: unknown): obj is IMyClubReqDto {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const dto: IMyClubReqDto = obj as IMyClubReqDto;
    return (
      typeof dto.name === "string" &&
      typeof dto.description === "string" &&
      typeof dto.logoPath === "string"
    );
  }
}
