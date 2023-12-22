import { IMyPlayerReqDto } from "../../../../../interfaces/schemas/requests/routes/my/player/IMyPlayerReqDto";

export class MyPlayerReqDto implements IMyPlayerReqDto {
  constructor(
    public readonly fullName: string,
    public readonly birthday: string,
    public readonly biography: string,
    public readonly imgPath: string,
  ) {}

  public static isValidDto(obj: unknown): obj is IMyPlayerReqDto {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const dto: IMyPlayerReqDto = obj as IMyPlayerReqDto;
    return (
      typeof dto.fullName === "string" &&
      typeof dto.birthday === "string" &&
      typeof dto.biography === "string" &&
      typeof dto.imgPath === "string"
    );
  }
}
