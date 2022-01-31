import React from 'react';
import {act} from 'react-test-renderer';

import {mount} from '../../utilities';
import {IsoComponent} from './IsoComponent';

// This test is somewhat useless... we don't need to test
// that React's `useEffect()` hooks work. What these test
// suites really care about is which `useEffect` gets called.
describe('useIsoLayoutEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('callback', () => {
    it('executes on mount', () => {
      const mockCallback = vi.fn();
      mount(<IsoComponent callback={mockCallback} />);

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledOnce();
    });

    it('executes again after dependency change', () => {
      const mockCallback = vi.fn();
      const wrapper = mount(<IsoComponent callback={mockCallback} />);

      vi.advanceTimersByTime(1);

      act(() => {
        wrapper.update(<IsoComponent callback={mockCallback} dependencyProp />);
      });

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });
});
