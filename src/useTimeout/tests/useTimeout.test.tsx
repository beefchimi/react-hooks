import React from 'react';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import type vitestTypes from 'vitest';
import {ExampleHookComponent} from './ExampleHookComponent';

describe('useTimeout', () => {
  const mockTimeStamp = 1234567890;
  let spyDateNow: vitestTypes.SpyInstance<[], number> | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
    spyDateNow = vi.spyOn(Date, 'now').mockImplementation(() => mockTimeStamp);
  });

  afterEach(() => {
    vi.useRealTimers();
    spyDateNow?.mockRestore();
  });

  describe('callback', () => {
    const mockDuration = 100;

    it('does not execute before the timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <ExampleHookComponent
          callback={mockCallback}
          duration={mockDuration}
        />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes after timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <ExampleHookComponent
          callback={mockCallback}
          duration={mockDuration}
        />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(<ExampleHookComponent callback={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(0);
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });

    it('executes `callback` immediately when `0`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(<ExampleHookComponent callback={mockCallback} duration={0} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(0);
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });
  });

  describe('playing', () => {
    const mockDuration = 100;
    const halfDuration = mockDuration / 2;

    it('does not execute when `false`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      create(
        <ExampleHookComponent
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
          <ExampleHookComponent
            callback={mockCallback}
            duration={mockDuration}
          />,
        );
      });

      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(halfDuration);

      // NOTE: I'd probably prefer to see an `onClick` + state change
      // over updating a prop directly.
      act(() => {
        component.update(
          <ExampleHookComponent
            callback={mockCallback}
            duration={mockDuration}
            playing={false}
          />,
        );
      });

      vi.advanceTimersByTime(mockDuration);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});
