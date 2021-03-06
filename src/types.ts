export interface BasicObject {
  [key: string]: unknown;
}

export type GlobalEventCallback = (event: any) => void;
export type GlobalEventTarget =
  | Document
  | Window
  | HTMLElement
  | null
  | undefined;

export type UtcMilliseconds = number;

export type SetIntervalId = number | ReturnType<typeof setInterval>;
export type SetTimeoutId = number | ReturnType<typeof setTimeout>;
