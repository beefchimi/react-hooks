type TimeElapsed = number;

export interface AnimationFrameData {
  startTime: DOMHighResTimeStamp;
  timestamp: DOMHighResTimeStamp;
  elapsed: TimeElapsed;
}

export type AnimationFrameCallback = (data: AnimationFrameData) => void;

export interface AnimationFrameHookOptions {
  playing?: boolean;
}

/*
interface AnimationFrameProgress {
  // TODO: Would be nice to type this between `0-100`
  progress: number;
  timeRemaining: number;
}
*/
