import {renderHook} from '@testing-library/react-hooks';

import {useScrollLock} from '../useScrollLock';

describe('useScrollLock', () => {
  it('is `true` upon `mount`', async () => {
    const {result} = renderHook(() => useScrollLock());
    const [scrollingLocked] = result.current;

    expect(scrollingLocked).toBe(true);
  });

  it('is `false` upon `unmount`', async () => {
    const {result, unmount} = renderHook(() => useScrollLock());
    const [scrollingLocked] = result.current;

    unmount();

    expect(scrollingLocked).toBe(false);
  });
});
