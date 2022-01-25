export interface BasicObject {
  [key: string]: unknown;
}

export type SetIntervalId = ReturnType<typeof setInterval>;
export type SetTimeoutId = ReturnType<typeof setTimeout>;
