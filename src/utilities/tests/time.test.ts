import {timeMeasurement, msToTime} from '../time';

const {msPerSec, msPerMin, msPerHr, msPerDay} = timeMeasurement;

describe('Time utilities', () => {
  const ms1Day = msPerDay;
  const ms15Hrs = msPerHr * 15;
  const ms10hrs15mins = msPerHr * 10 + msPerMin * 15;
  const ms4hrs15mins5secs = msPerHr * 4 + msPerMin * 15 + msPerSec * 5;

  describe('msToTime', () => {
    it('returns 24-hour breakdown from provided UTC milliseconds', () => {
      const greaterthan24Hrs = msToTime(
        ms1Day + ms15Hrs + ms10hrs15mins + ms4hrs15mins5secs,
      );

      expect(greaterthan24Hrs).toStrictEqual({
        days: 2,
        hours: 5,
        minutes: 30,
        seconds: 5,
      });

      const lessThan24Hrs = msToTime(ms10hrs15mins + ms4hrs15mins5secs);

      expect(lessThan24Hrs).toStrictEqual({
        days: 0,
        hours: 14,
        minutes: 30,
        seconds: 5,
      });

      const lessThan12Hrs = msToTime(ms15Hrs - ms4hrs15mins5secs);

      expect(lessThan12Hrs).toStrictEqual({
        days: 0,
        hours: 10,
        minutes: 44,
        seconds: 55,
      });
    });
  });
});
