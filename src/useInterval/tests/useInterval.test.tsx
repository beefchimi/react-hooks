import React from 'react';
import {act} from 'react-test-renderer';
import type vitestTypes from 'vitest';

import {mount} from '../../utilities';
import {IntervalComponent} from './IntervalComponent';

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

      mount(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes once after first iteration', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration);

      expect(mockCallback).toHaveBeenCalledOnce();
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });

    it('executes multiple times after enough time has passed', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration * 3);

      expect(mockCallback).toHaveBeenCalledTimes(3);
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(<IntervalComponent callback={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();

      // NOTE: When using a DOM environment (instead of `node`),
      // calling `vi.advanceTimersByTime(1)` will result in a
      // JS heap out of memory crash.
      vi.advanceTimersToNextTimer();

      expect(mockCallback).toHaveBeenCalledOnce();
    });

    it('executes `callback` immediately when `0`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(<IntervalComponent callback={mockCallback} duration={0} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('playing', () => {
    const mockDuration = 100;

    it('does not execute when `false`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(
        <IntervalComponent
          callback={mockCallback}
          duration={mockDuration}
          playing={false}
        />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration * 2);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will prevent `callback` from executing when toggled before expiration', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const wrapper = mount(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration / 2);

      act(() => {
        wrapper.update(
          <IntervalComponent
            callback={mockCallback}
            duration={mockDuration}
            playing={false}
          />,
        );
      });

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will restart the timeout from the beginning when toggled back and forth without `allowPausing`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const wrapper = mount(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);

      act(() => {
        wrapper.update(
          <IntervalComponent
            callback={mockCallback}
            duration={mockDuration}
            playing={false}
          />,
        );
      });

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();

      act(() => {
        wrapper.update(
          <IntervalComponent
            callback={mockCallback}
            duration={mockDuration}
            playing
          />,
        );
      });

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('allowPausing', () => {
    const mockDuration = 100;
    const pauseOffset = 10;

    it('will restart the timeout from the paused position when toggled back and forth', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      const wrapper = mount(
        <IntervalComponent
          callback={mockCallback}
          duration={mockDuration}
          allowPausing
        />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - pauseOffset);

      act(() => {
        wrapper.update(
          <IntervalComponent
            callback={mockCallback}
            duration={mockDuration}
            playing={false}
            allowPausing
          />,
        );
      });

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).not.toHaveBeenCalled();

      act(() => {
        wrapper.update(
          <IntervalComponent
            callback={mockCallback}
            duration={mockDuration}
            playing
            allowPausing
          />,
        );
      });

      vi.advanceTimersByTime(pauseOffset - 1);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('skipFirstInterval', () => {
    const mockDuration = 100;

    it('will fire immediately then resume execution at defined intervals', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(
        <IntervalComponent
          callback={mockCallback}
          duration={mockDuration}
          skipFirstInterval
        />,
      );

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledOnce();

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      vi.advanceTimersToNextTimer();
      expect(mockCallback).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });
});
