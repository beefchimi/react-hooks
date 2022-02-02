import type vitestTypes from 'vitest';
import {renderHook} from '@testing-library/react-hooks';

import {useInterval} from '../useInterval';
import type {IntervalHookOptions} from '../types';

describe('useInterval', () => {
  let mockTimestamp = 0;

  beforeEach(() => {
    const mockDate = new Date(1988, 10, 1);
    mockTimestamp = mockDate.valueOf();

    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('callback', () => {
    let spyDateNow: vitestTypes.SpyInstance<[], number> | null = null;

    beforeEach(() => {
      spyDateNow = vi
        .spyOn(Date, 'now')
        .mockImplementation(() => mockTimestamp);
    });

    afterEach(() => {
      spyDateNow?.mockRestore();
    });

    const mockDuration = 100;

    it('does not execute before the first interation has elapsed', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes once after first iteration', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });

    it('executes multiple times after enough time has passed', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration * 3);
      expect(mockCallback).toHaveBeenCalledTimes(3);
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback));

      expect(mockCallback).not.toHaveBeenCalled();

      // NOTE: When using a DOM environment (instead of `node`),
      // calling `vi.advanceTimersByTime(1)` will result in a
      // JS heap out of memory crash.
      vi.advanceTimersToNextTimer();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('executes `callback` immediately when `0`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback, {duration: 0}));

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('playing', () => {
    const mockDuration = 100;

    it('does not execute when `false`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() =>
        useInterval(mockCallback, {duration: mockDuration, playing: false}),
      );

      vi.advanceTimersByTime(mockDuration * 2);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will prevent `callback` from executing when toggled before expiration', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      const {rerender} = renderHook(
        ({playing}: IntervalHookOptions) =>
          useInterval(mockCallback, {duration: mockDuration, playing}),
        {initialProps: {playing: undefined}},
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration / 2);

      rerender({playing: false});

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will restart the timeout from the beginning when toggled back and forth without `allowPausing`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      const {rerender} = renderHook(({playing}: IntervalHookOptions) =>
        useInterval(mockCallback, {duration: mockDuration, playing}),
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);

      rerender({playing: false});

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();

      rerender({playing: true});

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('allowPausing', () => {
    const mockDuration = 100;
    const pauseOffset = 10;

    it('will restart the timeout from the paused position when toggled back and forth', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      const {rerender} = renderHook(({playing}: IntervalHookOptions) =>
        useInterval(mockCallback, {
          duration: mockDuration,
          allowPausing: true,
          playing,
        }),
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - pauseOffset);

      rerender({playing: false});

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();

      rerender({playing: true});

      vi.advanceTimersByTime(pauseOffset - 1);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('skipFirstInterval', () => {
    const mockDuration = 100;

    it('will fire immediately then resume execution at defined intervals', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() =>
        useInterval(mockCallback, {
          duration: mockDuration,
          skipFirstInterval: true,
        }),
      );

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    it('will not reset intervals if changed while mounted', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      // TODO: This test does not pass if `initialProps` is `undefined`.
      const {rerender} = renderHook(
        ({skipFirstInterval}) =>
          useInterval(mockCallback, {
            duration: mockDuration,
            skipFirstInterval,
          }),
        {initialProps: {skipFirstInterval: false}},
      );

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      rerender({skipFirstInterval: true});

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(2);

      rerender({skipFirstInterval: false});

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(3);

      rerender({skipFirstInterval: true});

      vi.advanceTimersByTime(mockDuration + 10);
      expect(mockCallback).toHaveBeenCalledTimes(4);
    });
  });
});
