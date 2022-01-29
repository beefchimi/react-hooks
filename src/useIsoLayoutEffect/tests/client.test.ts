// @vitest-environment happy-dom
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';

describe('useIsoLayoutEffect > client', () => {
  it('assigns `useLayoutEffect` when the DOM is available', () => {
    const result = useIsoLayoutEffect;
    expect(result.name).toBe('useLayoutEffect');
  });
});
