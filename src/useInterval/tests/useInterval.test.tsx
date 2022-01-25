import React from 'react';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import type vitestTypes from 'vitest';
import {IntervalComponent} from './IntervalComponent';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('callback', () => {
    const mockTimeStamp = 1234567890;
    let spyDateNow: vitestTypes.SpyInstance<[], number> | null = null;

    beforeEach(() => {
      spyDateNow = vi
        .spyOn(Date, 'now')
        .mockImplementation(() => mockTimeStamp);
    });

    afterEach(() => {
      spyDateNow?.mockRestore();
    });

    const mockDuration = 100;

    it('does not execute before the first interation has elapsed', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes once after first iteration', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledOnce();
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });

    it('executes multiple times after enough time has passed', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <IntervalComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration * 3);

      expect(mockCallback).toHaveBeenCalledTimes(3);
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(<IntervalComponent callback={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });

    it('executes `callback` immediately when `0`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(<IntervalComponent callback={mockCallback} duration={0} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('playing', () => {
    const mockDuration = 100;

    it('does not execute when `false`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
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
      let component: ReactTestRenderer;

      act(() => {
        component = create(
          <IntervalComponent callback={mockCallback} duration={mockDuration} />,
        );
      });

      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(mockDuration / 2);

      act(() => {
        component.update(
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
      let component: ReactTestRenderer;

      act(() => {
        component = create(
          <IntervalComponent callback={mockCallback} duration={mockDuration} />,
        );
      });

      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(mockDuration - 1);

      act(() => {
        component.update(
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
        component.update(
          <IntervalComponent
            callback={mockCallback}
            duration={mockDuration}
            playing
          />,
        );
      });

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('allowPausing', () => {
    const mockDuration = 100;
    const pauseOffset = 10;

    it('will restart the timeout from the paused position when toggled back and forth', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      let component: ReactTestRenderer;

      act(() => {
        component = create(
          <IntervalComponent
            callback={mockCallback}
            duration={mockDuration}
            allowPausing
          />,
        );
      });

      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(mockDuration - pauseOffset);

      act(() => {
        component.update(
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
        component.update(
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

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('skipFirstInterval', () => {
    const mockDuration = 100;

    it('will fire immediately then resume execution at defined intervals', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <IntervalComponent
          callback={mockCallback}
          duration={mockDuration}
          skipFirstInterval
        />,
      );

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();

      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });
});
