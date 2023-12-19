export interface IParticipantModel {
  readonly participantId: number;
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly playerId: number | null;
  readonly clubId: number | null;
}
