import { IAvailablePlayersRes } from "../../../../../interfaces/schemas/responses/routes/available/player/IAvailablePlayersRes";
import { BasePlayerRes } from "../../../base/BasePlayerRes";

export class AvailablePlayersRes
  extends BasePlayerRes
  implements IAvailablePlayersRes {}
