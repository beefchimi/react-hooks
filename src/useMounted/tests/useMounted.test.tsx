import {renderHook} from '@testing-library/react-hooks';

import {useMounted} from '../useMounted';

describe('useMounted', () => {
  it('is `true` upon `mount`', async () => {
    const {result} = renderHook(() => useMounted());
    const isMounted = result.current;

    expect(isMounted()).toBe(true);
  });

  it('is `false` upon `unmount`', async () => {
    const {result, unmount} = renderHook(() => useMounted());
    const isMounted = result.current;

    unmount();

    expect(isMounted()).toBe(false);
  });
});
