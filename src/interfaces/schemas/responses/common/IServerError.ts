export interface IServerError {
  readonly name: string;
  readonly message: string;
  readonly stackTrace: string | null;
}
