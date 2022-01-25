import {getDelay} from '../utilities';
import type {DelayFnArgs} from '../types';

describe('useInterval > utilities', () => {
  describe('getDelay()', () => {
    const mockArgs: DelayFnArgs = {
      duration: 100,
      timeRemaining: 60,
      allowPausing: false,
      skipFirstInterval: false,
      firstIntervalPlayed: false,
    };

    describe('early return', () => {
      it('returns 0 when `skipFirstInterval` is `true` and `firstIntervalPlayed` is `false`', () => {
        const result = getDelay({
          ...mockArgs,
          skipFirstInterval: true,
        });

        expect(result).toBe(0);
      });

      it('does not return 0 when `skipFirstInterval` is `false` and `firstIntervalPlayed` is `true`', () => {
        const result = getDelay({
          ...mockArgs,
          firstIntervalPlayed: true,
        });

        expect(result).not.toBe(0);
      });

      it('does not return 0 when both `skipFirstInterval` and `firstIntervalPlayed` are `true`', () => {
        const result = getDelay({
          ...mockArgs,
          skipFirstInterval: true,
          firstIntervalPlayed: true,
        });

        expect(result).not.toBe(0);
      });
    });

    it('returns `timeRemaining` when `allowPausing` is `true`', () => {
      const result = getDelay({
        ...mockArgs,
        allowPausing: true,
      });

      expect(result).toBe(mockArgs.timeRemaining);
    });

    it('returns `duration` when `allowPausing` is `false`', () => {
      const result = getDelay({
        ...mockArgs,
      });

      expect(result).toBe(mockArgs.duration);
    });
  });
});
