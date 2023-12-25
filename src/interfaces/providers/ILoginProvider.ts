import { IOrganizerModel } from "../models/IOrganizerModel";
import { IParticipantModel } from "../models/IParticipantModel";

export interface ILoginProvider {
  getOrganizer: (username: string) => Promise<IOrganizerModel | null>;

  getParticipant: (username: string) => Promise<IParticipantModel | null>;
}

export enum LoginQueries {
  GET_ORGANIZER_$UNAME = `SELECT * FROM "Organizer" WHERE "username" = $1`,
  GET_PARTICIPANT_$UNAME = `SELECT * FROM "Participant" WHERE "username" = $1`,
}
