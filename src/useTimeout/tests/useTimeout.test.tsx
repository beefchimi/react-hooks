import React from 'react';
import {act} from 'react-test-renderer';
import type vitestTypes from 'vitest';

import {mount} from '../../utilities';
import {TimeoutComponent} from './TimeoutComponent';

describe('useTimeout', () => {
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

    it('does not execute before the timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(
        <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('executes after timeout has expired', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(
        <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration);
      expect(mockCallback).toHaveBeenCalledWith(mockTimestamp);
    });
  });

  describe('duration', () => {
    it('executes `callback` immediately by default', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(<TimeoutComponent callback={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });

    it('executes `callback` immediately when `0`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(<TimeoutComponent callback={mockCallback} duration={0} />);

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('playing', () => {
    const mockDuration = 100;

    it('does not execute when `false`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      mount(
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
      const wrapper = mount(
        <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration / 2);

      act(() => {
        wrapper.update(
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
      const wrapper = mount(
        <TimeoutComponent callback={mockCallback} duration={mockDuration} />,
      );

      expect(mockCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(mockDuration - 1);

      act(() => {
        wrapper.update(
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
        wrapper.update(
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
