export interface IServerError {
  readonly name: string;
  readonly message: string;
  readonly stackTrace: string | null;
}

export class ModelMismatchError extends Error {
  constructor(public readonly model: unknown) {
    super(
      `Server and database not agreeing on model. Model was: ${JSON.stringify(
        model,
      )}`,
    );
    this.name = "ModelMismatchError";
  }
}
