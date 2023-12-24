import { IOrganizerModel } from "../models/IOrganizerModel";
import { IParticipantModel } from "../models/IParticipantModel";

export interface ISignupProvider {
  doesOrganizerByUsernameExist: (username: string) => Promise<boolean>;

  doesOrganizerByEmailExist: (email: string) => Promise<boolean>;

  createOrganizer: (
    username: string,
    password: string,
    email: string,
  ) => Promise<IOrganizerModel>;

  doesParticipantByUsernameExist: (username: string) => Promise<boolean>;

  doesParticipantByEmailExist: (username: string) => Promise<boolean>;

  createParticipant: (
    username: string,
    password: string,
    email: string,
  ) => Promise<IParticipantModel>;
}

export enum SignupQueries {
  DOES_ORGANIZER_EXIST_$UNAME = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE username = $1) AS "recordExists"`,
  DOES_ORGANIZER_EXIST_$EMAIL = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE email = $1) AS "recordExists"`,
  CREATE_ORGANIZER_$UNAME_$PSWRD_$EMAIL = `INSERT INTO "Organizer" (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
  DOES_PARTICIPANT_EXIST_$UNAME = `SELECT EXISTS (SELECT * FROM "Participant" WHERE username = $1) AS "recordExists"`,
  DOES_PARTICIPANT_EXIST_$EMAIL = `SELECT EXISTS (SELECT * FROM "Participant" WHERE email = $1) AS "recordExists"`,
  CREATE_PARTICIPANT_$UNAME_$PSWRD_$EMAIL = `INSERT INTO "Participant" (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
}
