import React from 'react';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import type vitestTypes from 'vitest';
import {TimeoutComponent} from './TimeoutComponent';

describe('useTimeout', () => {
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

    it('does not execute before the timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes after timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(<TimeoutComponent callback={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });

    it('executes `callback` immediately when `0`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(<TimeoutComponent callback={mockCallback} duration={0} />);

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
        <TimeoutComponent
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
          <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
        );
      });

      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(mockDuration / 2);

      act(() => {
        component.update(
          <TimeoutComponent
            callback={mockCallback}
            duration={mockDuration}
            playing={false}
          />,
        );
      });

      vi.advanceTimersByTime(mockDuration);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('will restart the timeout from the beginning when toggled back and forth', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);
      let component: ReactTestRenderer;

      act(() => {
        component = create(
          <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
        );
      });

      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(mockDuration - 1);

      act(() => {
        component.update(
          <TimeoutComponent
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
          <TimeoutComponent
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
});
