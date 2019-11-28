export enum ExecutionContext {
  Synchronous,
  Asynchronous,
}

export interface Context {
  execution: ExecutionContext;
}
