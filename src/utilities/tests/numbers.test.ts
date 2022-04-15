import {flipNumberSign, leftPadNumber} from '../numbers';

describe('Number utilities', () => {
  describe('flipNumberSign', () => {
    it('flips positive to negative value', () => {
      const negativeResult = flipNumberSign(1);
      expect(negativeResult).toBe(-1);
    });

    it('flips negative to positive value', () => {
      const positiveResult = flipNumberSign(-1);
      expect(positiveResult).toBe(1);
    });

    it('does not flip `0` value', () => {
      const zeroResult = flipNumberSign(0);
      expect(zeroResult).toBe(0);
    });
  });

  describe('leftPadNumber', () => {
    describe('default options', () => {
      it('returns a string with a single leading `0` when passed a single-digit value', () => {
        const result = leftPadNumber(9);
        expect(result).toBe('09');
      });

      it('returns a string without a leading `0` when passed a double-digit value', () => {
        const result = leftPadNumber(24);
        expect(result).toBe('24');
      });
    });

    describe('padding', () => {
      it('returns without any prefix values when `padding` is less than value length', () => {
        const result = leftPadNumber(1234, {padding: 3});
        expect(result).toBe('1234');
      });

      it('returns without any prefix values when `padding` is equal to value length', () => {
        const result = leftPadNumber(12345, {padding: 5});
        expect(result).toBe('12345');
      });

      it('returns with leading prefix values when `padding` is greater than value length', () => {
        const result = leftPadNumber(56, {padding: 6});
        expect(result).toBe('000056');
      });
    });

    describe('prefix', () => {
      it('returns with custom prefix value', () => {
        const result = leftPadNumber(8, {prefix: '-'});
        expect(result).toBe('-8');
      });
    });
  });
});
