import {useIsoLayoutEffect} from '../useIsoLayoutEffect';

describe('useIsoLayoutEffect > server side', () => {
  it('assigns `useEffect` when the DOM is not available', () => {
    const result = useIsoLayoutEffect;
    expect(result.name).toBe('useEffect');
  });
});
