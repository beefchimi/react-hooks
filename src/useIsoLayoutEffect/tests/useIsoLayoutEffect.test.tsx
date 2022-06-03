import {renderHook} from '@testing-library/react-hooks';

import {useIsoLayoutEffect} from '../useIsoLayoutEffect';

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
    it('executes on mount', async () => {
      const mockCallback = vi.fn();

      renderHook(() => useIsoLayoutEffect(mockCallback));

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('executes again after dependency change', async () => {
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({dependency}) => useIsoLayoutEffect(mockCallback, [dependency]),
        {initialProps: {dependency: 'foo'}},
      );

      vi.advanceTimersByTime(1);

      rerender({dependency: 'bar'});

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });
});
