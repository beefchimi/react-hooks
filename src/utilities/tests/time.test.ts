import {timeMeasurement, flipTimeSign, msToTime} from '../time';
import type {Time24HourBreakdown} from '../time';

const {msPerSec, msPerMin, msPerHr, msPerDay} = timeMeasurement;

describe('Time utilities', () => {
  const ms1Day = msPerDay;
  const ms15Hrs = msPerHr * 15;
  const ms10Hrs15Mins = msPerHr * 10 + msPerMin * 15;
  const ms4Hrs15Mins5Secs = msPerHr * 4 + msPerMin * 15 + msPerSec * 5;

  const ms11Days10Hrs20Mins54Secs = 987654321;

  describe('flipTimeSign', () => {
    it('flips positive values to negative', async () => {
      const mockPositiveTime: Time24HourBreakdown = {
        days: 0,
        hours: 1,
        minutes: 10,
        seconds: 20,
      };
      const result = flipTimeSign(mockPositiveTime);

      expect(result).toStrictEqual({
        days: 0,
        hours: -1,
        minutes: -10,
        seconds: -20,
      });
    });

    it('flips negative values to positive', async () => {
      const mockNegativeTime: Time24HourBreakdown = {
        days: -4,
        hours: -5,
        minutes: -23,
        seconds: -2,
      };
      const result = flipTimeSign(mockNegativeTime);

      expect(result).toStrictEqual({
        days: 4,
        hours: 5,
        minutes: 23,
        seconds: 2,
      });
    });

    it('does not flip sign on `0` values', async () => {
      const mockMixedTime: Time24HourBreakdown = {
        days: 0,
        hours: 1,
        minutes: 0,
        seconds: -1,
      };
      const result = flipTimeSign(mockMixedTime);

      expect(result).toStrictEqual({
        days: 0,
        hours: -1,
        minutes: 0,
        seconds: 1,
      });
    });
  });

  describe('msToTime', () => {
    it('returns 24-hour breakdown from provided UTC milliseconds', async () => {
      const greaterthan24Hrs = msToTime(
        ms1Day + ms15Hrs + ms10Hrs15Mins + ms4Hrs15Mins5Secs,
      );

      expect(greaterthan24Hrs).toStrictEqual({
        days: 2,
        hours: 5,
        minutes: 30,
        seconds: 5,
      });

      const lessThan24Hrs = msToTime(ms10Hrs15Mins + ms4Hrs15Mins5Secs);

      expect(lessThan24Hrs).toStrictEqual({
        days: 0,
        hours: 14,
        minutes: 30,
        seconds: 5,
      });

      const lessThan12Hrs = msToTime(ms15Hrs - ms4Hrs15Mins5Secs);

      expect(lessThan12Hrs).toStrictEqual({
        days: 0,
        hours: 10,
        minutes: 44,
        seconds: 55,
      });
    });

    it('returns breakdown from positive milliseconds', async () => {
      const ms18Secs = msToTime(msPerSec * 18);

      expect(ms18Secs).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 18,
      });
    });

    it('rounds down all properties to the nearest value', async () => {
      const roundedDownWhole = msToTime(ms11Days10Hrs20Mins54Secs);

      expect(roundedDownWhole).toStrictEqual({
        days: 11,
        hours: 10,
        minutes: 20,
        seconds: 54,
      });

      const roundedDownDecimals = msToTime(ms11Days10Hrs20Mins54Secs / 10000);

      expect(roundedDownDecimals).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 38,
      });

      const lessThan1Min = msToTime(msPerMin - 1);

      expect(lessThan1Min).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 59,
      });

      const lessThan1Sec = msToTime(msPerSec - 1);

      expect(lessThan1Sec).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it('returns breakdown from `0` milliseconds', async () => {
      const outOfTime = msToTime(0);

      expect(outOfTime).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it('returns breakdown from negative milliseconds', async () => {
      const timeAgo1Sec = msToTime(-msPerSec);

      expect(timeAgo1Sec).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: -1,
      });

      const timeAgo11Days = msToTime(-ms11Days10Hrs20Mins54Secs);

      expect(timeAgo11Days).toStrictEqual({
        days: -11,
        hours: -10,
        minutes: -20,
        seconds: -54,
      });
    });
  });
});
