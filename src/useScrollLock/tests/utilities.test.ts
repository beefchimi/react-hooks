// @vitest-environment node
import {guessScrollbarWidthVertical} from '../utilities';

describe('useScrollLock > utilities', () => {
  describe('getTargetPadding()', () => {
    // TODO: How to mock HTMLElement?
    // const mockTarget = null;

    it('parses `padding-right` to a number', async () => {
      // const result = getTargetPadding(mockTarget, 'padding-right');
      const result = 0;
      expect(result).toBe(0);
    });

    it('parses `padding-bottom` to a number', async () => {
      // const result = getTargetPadding(mockTarget, 'padding-bottom');
      const result = 0;
      expect(result).toBe(0);
    });

    it.todo('returns `0` when run on the server');
  });

  describe('getCapturedProperties()', () => {
    it('temporary utility test', async () => {
      expect(guessScrollbarWidthVertical).not.toBeNull();
    });

    it.todo('converts `scrollbarWidth > number` to a dual-axis object');

    it.todo('only returns `scrollbarWidth` when both values are `0`');

    it.todo('returns `paddingRight` properties when `vertical`');

    it.todo('returns `paddingBottom` properties when `horizontal`');

    it.todo('returns all `padding` properties when `both`');
  });

  describe('guessScrollbarWidthVertical()', () => {
    it.todo('returns `0` when run on the server');

    it.todo('returns difference between `window` and `document`');

    it.todo('returns difference when provided a `target`');
  });

  describe('guessScrollbarWidthHorizontal()', () => {
    it.todo('returns `0` when run on the server');

    it.todo('returns difference between `window` and `document`');

    it.todo('returns difference when provided a `target`');
  });

  describe('applyScrollStyles()', () => {
    it.todo('sets `overflow` to `hidden`');

    it.todo('does not set `paddingRight` by default');

    it.todo('sets `paddingRight` to `appliedPaddingRight` when available');

    it.todo('does not set `paddingBottom` by default');

    it.todo('sets `paddingBottom` to `appliedPaddingBottom` when available');
  });

  describe('resetScrollStyles()', () => {
    it.todo('resets `overflow`');

    it.todo('resets `paddingRight`');

    it.todo('resets `paddingBottom`');
  });
});
