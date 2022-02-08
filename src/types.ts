export interface BasicObject {
  [key: string]: unknown;
}

export type GlobalEventCallback = (event: any) => void;
export type GlobalEventTarget = Document | Window | HTMLElement | null;

export type UtcMilliseconds = number;

// NOTE: TypeScript types this as `number`, but `0` should not be supported.
export type RequestAnimationFrameId = ReturnType<typeof requestAnimationFrame>;

export type SetIntervalId = number | ReturnType<typeof setInterval>;
export type SetTimeoutId = number | ReturnType<typeof setTimeout>;
