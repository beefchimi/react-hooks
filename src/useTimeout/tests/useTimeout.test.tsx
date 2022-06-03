import type vitestTypes from 'vitest';
import {renderHook} from '@testing-library/react-hooks';

import {useTimeout} from '../useTimeout';
import type {TimeoutHookOptions} from '../types';

describe('useTimeout', () => {
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

    it('does not execute before the timeout has expired', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useTimeout(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes after timeout has expired', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useTimeout(mockCallback, {duration: mockDuration}));

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useTimeout(mockCallback));

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('executes `callback` immediately when `0`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useTimeout(mockCallback, {duration: 0}));

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('playing', () => {
    const mockDuration = 100;

    it('does not execute when `false`', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() =>
        useTimeout(mockCallback, {duration: mockDuration, playing: false}),
      );

      vi.advanceTimersByTime(mockDuration * 2);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will prevent `callback` from executing when toggled before expiration', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      const {rerender} = renderHook(
        ({playing}: TimeoutHookOptions) =>
          useTimeout(mockCallback, {duration: mockDuration, playing}),
        {initialProps: {playing: undefined}},
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration / 2);

      rerender({playing: false});

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will restart the timeout from the beginning when toggled back and forth', async () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      const {rerender} = renderHook(({playing}: TimeoutHookOptions) =>
        useTimeout(mockCallback, {duration: mockDuration, playing}),
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);

      rerender({playing: false});

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();

      rerender({playing: true});

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });
});
