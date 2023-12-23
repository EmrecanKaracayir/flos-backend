export interface IUserProvider {}

export enum UserQueries {
  DOES_ORGANIZER_EXIST_$ORID = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE "organizerId" = $1) AS "recordExists"`,
  DOES_PARTICIPANT_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1) AS "recordExists"`,
}
