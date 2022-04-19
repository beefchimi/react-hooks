import {renderHook} from '@testing-library/react-hooks';

import {useMounted} from '../useMounted';

describe('useMounted', () => {
  it('is `true` upon `mount`', () => {
    const {result} = renderHook(() => useMounted());
    const isMounted = result.current;

    expect(isMounted()).toBe(true);
  });

  it('is `false` upon `unmount`', () => {
    const {result, unmount} = renderHook(() => useMounted());
    const isMounted = result.current;

    unmount();

    expect(isMounted()).toBe(false);
  });
});
