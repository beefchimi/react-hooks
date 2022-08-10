import {renderHook} from '@testing-library/react-hooks';

import {useScrollLock} from '../useScrollLock';

// TODO: Tests have not yet been authored for this hook.
// However, a sandbox has been created:
// https://codesandbox.io/s/usescrolllock-6ocshv
describe('useScrollLock', () => {
  describe('scrollingLocked', () => {
    it('is `false` upon `mount`', async () => {
      const {result} = renderHook(() => useScrollLock());
      const [scrollingLocked] = result.current;

      expect(scrollingLocked).toBe(false);
    });

    it.todo('set back to `false` upon `unmount`');
  });

  describe('setScrollLock', () => {
    it.todo('updates `scrollingLocked` state');
  });

  describe('options > target', () => {
    it.todo('defaults to `document.body`');

    it.todo('uses custom `target`');
  });

  describe('options > scrollAxis', () => {
    it.todo('defaults to `vertical`');

    it.todo('allows `horizontal` scrolling');

    it.todo('allows scrolling on both axis');
  });

  describe('options > scrollbarOffset', () => {
    it.todo('accepts custom `width`');

    it.todo('allows bypassing `padding` styles');
  });

  describe('options > onLock', () => {
    it.todo('is called with `captured`');
  });

  describe('options > onUnlock', () => {
    it.todo('is called without arguments');
  });
});
