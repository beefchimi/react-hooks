import {useEffect, useRef} from 'react';

import type {RequestAnimationFrameId} from '../types';
import type {AnimationFrameCallback, AnimationFrameHookOptions} from './types';

const DEFAULT_OPTIONS: Required<AnimationFrameHookOptions> = {
  playing: true,
};

export function useAnimationFrame(
  callback: AnimationFrameCallback,
  options?: AnimationFrameHookOptions,
): void {
  const {playing} = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const callbackRef = useRef<AnimationFrameCallback>();
  const animationFrameRef = useRef<RequestAnimationFrameId>(0);

  const startTime = useRef(0);
  const elapsed = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick: FrameRequestCallback = (time) => {
      if (startTime.current === 0) {
        startTime.current = time;
      }

      elapsed.current = time - startTime.current;

      // NOTE: The loop must get called before the callback,
      // as we don't know how expensive the callback will be.
      loop();

      // TODO: Allow for calling at intervals.
      callbackRef.current?.({
        startTime: startTime.current,
        timestamp: time,
        elapsed: elapsed.current,
      });
    };

    function loop() {
      animationFrameRef.current = requestAnimationFrame(tick);
    }

    if (playing) {
      loop();
    }

    return () => {
      console.log('unmounted or `playing` changed');
      startTime.current = 0;
      elapsed.current = 0;
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [playing]);
}
