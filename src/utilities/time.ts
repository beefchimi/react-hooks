import type {UtcMilliseconds} from '../types';
import {flipNumberSign} from './numbers';

export interface Time24HourBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const hrsPerDay = 24;

const minsPerHr = 60;
const minsPerDay = minsPerHr * hrsPerDay;

const secsPerMin = 60;
const secsPerHr = secsPerMin * minsPerHr;
const secsPerDay = secsPerHr * hrsPerDay;

const msPerSec = 1000;
const msPerMin = msPerSec * secsPerMin;
const msPerHr = msPerMin * minsPerHr;
const msPerDay = msPerHr * hrsPerDay;

export const timeMeasurement = {
  hrsPerDay,
  minsPerHr,
  minsPerDay,
  secsPerMin,
  secsPerHr,
  secsPerDay,
  msPerSec,
  msPerMin,
  msPerHr,
  msPerDay,
};

export function flipTimeSign({
  days,
  hours,
  minutes,
  seconds,
}: Time24HourBreakdown) {
  return {
    days: flipNumberSign(days),
    hours: flipNumberSign(hours),
    minutes: flipNumberSign(minutes),
    seconds: flipNumberSign(seconds),
  };
}

export function msToTime(ms: UtcMilliseconds): Time24HourBreakdown {
  const isNegative = Math.sign(ms) === -1;
  const forcedPositiveMs = Math.abs(ms);

  const totalSeconds = Math.floor(forcedPositiveMs / msPerSec);
  const totalMinutes = Math.floor(totalSeconds / secsPerMin);
  const totalHours = Math.floor(totalMinutes / minsPerHr);

  const time = {
    days: Math.floor(totalHours / hrsPerDay),
    hours: totalHours % hrsPerDay,
    minutes: totalMinutes % minsPerHr,
    seconds: totalSeconds % secsPerMin,
  };

  return isNegative ? flipTimeSign(time) : time;
}
