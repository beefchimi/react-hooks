import type {UtcMilliseconds} from '../types';

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

export function msToTime(ms: UtcMilliseconds) {
  const seconds = Math.floor(ms / msPerSec);
  const minutes = Math.floor(seconds / secsPerMin);
  const hours = Math.floor(minutes / minsPerHr);

  return {
    days: Math.floor(hours / hrsPerDay),
    hours: hours % hrsPerDay,
    minutes: minutes % minsPerHr,
    seconds: seconds % secsPerMin,
  };
}
