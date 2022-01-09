import React from 'react';
import renderer from 'react-test-renderer';
import type vitestTypes from 'vitest';
import {ExampleHookComponent} from './ExampleHookComponent';

describe('useTimeout', () => {
  const mockTimeStamp = 1234567890;
  let spyDateNow: vitestTypes.JestMockCompat<[], number> | null = null;

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

    test('Does not execute before the timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderer.create(
        <ExampleHookComponent
          callback={mockCallback}
          duration={mockDuration}
        />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('Executes after timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderer.create(
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
    test('Executes `callback` immediately by default', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderer.create(<ExampleHookComponent callback={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(0);
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });

    test('Executes `callback` immediately when `0`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderer.create(
        <ExampleHookComponent callback={mockCallback} duration={0} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(0);
      expect(mockCallback).toHaveBeenCalledWith(mockTimeStamp);
    });
  });

  describe('playing', () => {
    const mockDuration = 100;

    test('Does not execute when `false`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderer.create(
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
  });
});
