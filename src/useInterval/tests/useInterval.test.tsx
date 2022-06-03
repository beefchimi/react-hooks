import type vitestTypes from 'vitest';
import {renderHook} from '@testing-library/react-hooks';

import {useInterval} from '../useInterval';
import type {IntervalCallback, IntervalHookOptions} from '../types';

describe('useInterval', () => {
  let mockTimestamp = 0;

  beforeEach(() => {
    const mockDate = new Date(1988, 10, 1);
    mockTimestamp = mockDate.getTime();

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

    it('does not execute before the first interation has elapsed', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes once after first iteration', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });

    it('executes multiple times after enough time has passed', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const iterations = 3;

      renderHook(() => useInterval(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration * iterations);
      expect(mockCallback).toHaveBeenCalledTimes(iterations);
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });

    it('seemlessly continues (does not restart) iterations when `callback` changes mid-iteration', async () => {
      const mockInitialCallback = vi.fn((timestamp) => timestamp);

      const {rerender} = renderHook(
        ({callback}: {callback: IntervalCallback}) =>
          useInterval(callback, {duration: mockDuration}),
        {initialProps: {callback: mockInitialCallback}},
      );

      vi.advanceTimersByTime(mockDuration);
      expect(mockInitialCallback).toHaveBeenCalledTimes(1);
      expect(mockInitialCallback).toHaveReturnedWith(mockTimestamp);

      vi.advanceTimersByTime(mockDuration - 1);

      const mockReturn = 'foo';
      const mockNewCallback = vi.fn((_timestamp) => mockReturn);

      rerender({callback: mockNewCallback});

      vi.advanceTimersByTime(1);

      expect(mockNewCallback).toHaveBeenCalledTimes(1);
      expect(mockNewCallback).toHaveReturnedWith(mockReturn);

      expect(mockInitialCallback).not.toHaveBeenCalledTimes(2);
      expect(mockNewCallback).not.toHaveBeenCalledTimes(2);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback));

      expect(mockCallback).not.toHaveBeenCalled();

      // NOTE: When using a DOM environment (instead of `node`),
      // calling `vi.advanceTimersByTime(1)` will result in a
      // JS heap out of memory crash.
      vi.advanceTimersToNextTimer();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('executes `callback` immediately when `0`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useInterval(mockCallback, {duration: 0}));

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('playing', () => {
    const mockDuration = 100;

    it('does not execute when `false`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() =>
        useInterval(mockCallback, {duration: mockDuration, playing: false}),
      );

      vi.advanceTimersByTime(mockDuration * 2);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will prevent `callback` from executing when toggled before expiration', async () => {
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

    it('will restart the timeout from the beginning when toggled back and forth without `allowPausing`', async () => {
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

    it('will restart the timeout from the paused position when toggled back and forth', async () => {
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

    it('will fire immediately then resume execution at defined intervals', async () => {
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
      expect(mockCallback).not.toHaveBeenCalledTimes(4);
    });

    it('will not reset intervals if changed while mounted', async () => {
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
      expect(mockCallback).not.toHaveBeenCalledTimes(5);
    });
  });

  describe('onPause', () => {
    const mockDuration = 100;

    it('does not execute when `playing`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const mockOnPause = vi.fn((timeData) => timeData);

      renderHook(() =>
        useInterval(mockCallback, {
          duration: mockDuration,
          onPause: mockOnPause,
        }),
      );

      vi.advanceTimersByTime(mockDuration * 2);
      expect(mockOnPause).not.toHaveBeenCalled();
    });

    it('does not execute immediately if hook is initialized with `!playing`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const mockOnPause = vi.fn((timeData) => timeData);

      renderHook(() =>
        useInterval(mockCallback, {
          duration: mockDuration,
          playing: false,
          onPause: mockOnPause,
        }),
      );

      vi.advanceTimersByTime(mockDuration * 2);
      expect(mockOnPause).not.toHaveBeenCalled();
    });

    it('executes with `timeData` when `playing` is toggled to `false`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const mockOnPause = vi.fn((timeData) => timeData);

      const {rerender} = renderHook(
        ({playing}: IntervalHookOptions) =>
          useInterval(mockCallback, {
            duration: mockDuration,
            onPause: mockOnPause,
            playing,
          }),
        {initialProps: {playing: true}},
      );

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockOnPause).not.toHaveBeenCalled();

      vi.advanceTimersByTime(mockDuration / 2);

      rerender({playing: false});

      expect(mockOnPause).toHaveBeenCalledTimes(1);
      expect(mockOnPause).toHaveBeenCalledWith({
        progress: 50,
        timeRemaining: mockDuration / 2,
      });

      rerender({playing: true});

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockOnPause).not.toHaveBeenCalledTimes(2);

      rerender({playing: false});
      expect(mockOnPause).toHaveBeenCalledTimes(2);
      expect(mockOnPause).toHaveBeenCalledWith({
        progress: 99,
        timeRemaining: 1,
      });

      rerender({playing: true});

      vi.advanceTimersByTime(mockDuration * 2 + 10);

      rerender({playing: false});

      expect(mockCallback).toHaveBeenCalledTimes(3);
      expect(mockOnPause).toHaveBeenCalledTimes(3);
      expect(mockOnPause).toHaveBeenCalledWith({
        progress: 10,
        timeRemaining: mockDuration - 10,
      });
    });

    it('continues along timeline when `allowPausing`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const mockOnPause = vi.fn((timeData) => timeData);

      const {rerender} = renderHook(
        ({playing}: IntervalHookOptions) =>
          useInterval(mockCallback, {
            duration: mockDuration,
            onPause: mockOnPause,
            allowPausing: true,
            playing,
          }),
        {initialProps: {playing: true}},
      );

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockOnPause).not.toHaveBeenCalled();

      vi.advanceTimersByTime(20);

      rerender({playing: false});

      expect(mockOnPause).toHaveBeenCalledTimes(1);
      expect(mockOnPause).toHaveBeenCalledWith({
        progress: 20,
        timeRemaining: 80,
      });

      rerender({playing: true});

      vi.advanceTimersByTime(mockDuration - 20);
      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(mockOnPause).not.toHaveBeenCalledTimes(2);

      rerender({playing: false});
      expect(mockOnPause).toHaveBeenCalledTimes(2);
      expect(mockOnPause).toHaveBeenCalledWith({
        progress: 0,
        timeRemaining: mockDuration,
      });

      rerender({playing: true});

      vi.advanceTimersByTime(mockDuration * 2 + 10);

      rerender({playing: false});

      expect(mockCallback).toHaveBeenCalledTimes(4);
      expect(mockOnPause).toHaveBeenCalledTimes(3);
      expect(mockOnPause).toHaveBeenCalledWith({
        progress: 10,
        timeRemaining: mockDuration - 10,
      });
    });
  });
});
