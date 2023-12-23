export interface IServerError {
  readonly name: string;
  readonly message: string;
  readonly stackTrace: string | null;
}

export class ModelMismatchError extends Error {
  constructor(public readonly model: unknown) {
    super(
      `Server and database not agreeing on a model. Model was: ${JSON.stringify(
        model,
      )}`,
    );
    this.name = "ModelMismatchError";
  }
}

export class UnexpectedQueryResultError extends Error {
  constructor() {
    super("Query result was unexpected. Contact with the developers.");
    this.name = "UnexpectedQueryResultError";
  }
}

export class PrecisionLossError extends Error {
  constructor(sourceDataType: string, targetDataType: string) {
    super(
      `Cannot safely cast from '${sourceDataType}' to '${targetDataType}'.`,
    );
    this.name = "PrecisionLossError";
  }
}

export class UnexpectedUserRole extends Error {
  constructor(userRole: string) {
    super(`Unexpected user role: '${userRole}'. Contact with the developers.`);
    this.name = "UnexpectedUserRole";
  }
}
