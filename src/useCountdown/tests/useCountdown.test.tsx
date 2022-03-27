import {renderHook} from '@testing-library/react-hooks';

import {timeMeasurement} from '../../utilities';
import type {UtcMilliseconds} from '../../types';

import {useCountdown} from '../useCountdown';

const MOCK_DATE_ARGS = [1988, 10, 1];
const MOCK_DATE_24H_LATER = MOCK_DATE_ARGS[2] + 1;

const oneSecond = timeMeasurement.msPerSec;
const halfSecond = oneSecond / 2;
const twoSeconds = oneSecond * 2;
const threeSeconds = oneSecond * 3;
const fourSeconds = oneSecond * 4;

describe('useCountdown', () => {
  let mockTimeStart = 0;
  let mockTime24hLater = 0;

  beforeEach(() => {
    const mockDateStart = new Date(
      MOCK_DATE_ARGS[0],
      MOCK_DATE_ARGS[1],
      MOCK_DATE_ARGS[2],
    );
    const mockDate24hLater = new Date(
      MOCK_DATE_ARGS[0],
      MOCK_DATE_ARGS[1],
      MOCK_DATE_24H_LATER,
    );

    mockTimeStart = mockDateStart.getTime();
    mockTime24hLater = mockDate24hLater.getTime();

    vi.useFakeTimers();
    vi.setSystemTime(mockDateStart);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('callback', () => {
    it('executes immediately', () => {
      const mockCallback = vi.fn((difference) => difference);

      renderHook(() => useCountdown(mockCallback, mockTimeStart));

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('executes again after first second', () => {
      const mockCallback = vi.fn((difference) => difference);

      renderHook(() => useCountdown(mockCallback, mockTimeStart));

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(mockCallback).not.toHaveBeenCalledTimes(3);
    });

    it('executes multiple times after enough time has passed', () => {
      const mockCallback = vi.fn((difference) => difference);
      const iterations = 5;

      renderHook(() => useCountdown(mockCallback, mockTimeStart));

      vi.advanceTimersByTime(oneSecond * iterations);
      // Has been called `iterations + 1` because the `callback`
      // fires immediately upon render, and then the timers
      // run at 1 second intervals.
      expect(mockCallback).toHaveBeenCalledTimes(iterations + 1);
    });
  });

  describe('timeTarget', () => {
    it('returns 0 as first result when using `Date.now()`', () => {
      const mockCallback = vi.fn((difference) => difference);

      renderHook(() => useCountdown(mockCallback, mockTimeStart));

      expect(mockCallback).toHaveBeenCalledWith(0);
    });

    it('will produce negative 1 second increments when using `Date.now()`', () => {
      const mockCallback = vi.fn((difference) => difference);

      renderHook(() => useCountdown(mockCallback, mockTimeStart));

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(-Math.abs(oneSecond));

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(-Math.abs(twoSeconds));

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(-Math.abs(threeSeconds));

      vi.advanceTimersByTime(oneSecond - 1);
      expect(mockCallback).not.toHaveBeenCalledWith(-Math.abs(fourSeconds));

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledWith(-Math.abs(fourSeconds));
    });

    it('will produce a result reduced by 1 second per interval', () => {
      const mockCallback = vi.fn((difference) => difference);
      const initialOffset = mockTime24hLater - mockTimeStart;

      renderHook(() => useCountdown(mockCallback, mockTime24hLater));

      expect(mockCallback).toHaveBeenCalledWith(initialOffset);
      expect(initialOffset).toStrictEqual(timeMeasurement.msPerDay);

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(initialOffset - oneSecond);

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(initialOffset - twoSeconds);

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(initialOffset - threeSeconds);

      vi.advanceTimersByTime(oneSecond - 1);
      expect(mockCallback).not.toHaveBeenCalledWith(
        initialOffset - fourSeconds,
      );

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledWith(initialOffset - fourSeconds);
    });

    it('immediately returns new `difference` when updated mid-iteration', () => {
      const mockCallback = vi.fn((difference) => difference);
      const initialOffset = mockTime24hLater - mockTimeStart;

      const {rerender} = renderHook(
        ({timeTarget}: {timeTarget: UtcMilliseconds}) =>
          useCountdown(mockCallback, timeTarget),
        {initialProps: {timeTarget: mockTime24hLater}},
      );

      expect(mockCallback).toHaveBeenCalledWith(initialOffset);

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(initialOffset - oneSecond);

      rerender({timeTarget: Date.now()});

      expect(mockCallback).toHaveBeenCalledWith(0);

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(-Math.abs(oneSecond));

      expect(mockCallback).toHaveBeenCalledTimes(4);
      expect(mockCallback).not.toHaveBeenCalledTimes(5);
    });

    it('continues mid-interval when `timeRange` changes while iterating', () => {
      const mockCallback = vi.fn((difference) => difference);
      const initialOffset = mockTime24hLater - mockTimeStart;

      const {rerender} = renderHook(
        ({timeTarget}: {timeTarget: UtcMilliseconds}) =>
          useCountdown(mockCallback, timeTarget),
        {initialProps: {timeTarget: mockTime24hLater}},
      );

      expect(mockCallback).toHaveBeenCalledWith(initialOffset);

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(initialOffset - oneSecond);

      vi.advanceTimersByTime(halfSecond);
      rerender({timeTarget: Date.now()});

      expect(mockCallback).toHaveBeenCalledWith(0);

      vi.advanceTimersByTime(halfSecond);
      expect(mockCallback).toHaveBeenCalledWith(-Math.abs(halfSecond));

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledWith(
        -Math.abs(oneSecond + halfSecond),
      );

      expect(mockCallback).toHaveBeenCalledTimes(5);
      expect(mockCallback).not.toHaveBeenCalledTimes(6);
    });
  });

  describe('pause', () => {
    it('does not execute when `true`', () => {
      const mockCallback = vi.fn((timestamp) => timestamp);

      renderHook(() => useCountdown(mockCallback, mockTimeStart, true));

      vi.advanceTimersByTime(twoSeconds);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('stops performing iterations', () => {
      const mockCallback = vi.fn((difference) => difference);

      const {rerender} = renderHook(
        ({pause}: {pause: boolean}) =>
          useCountdown(mockCallback, mockTimeStart, pause),
        {initialProps: {pause: false}},
      );

      vi.advanceTimersByTime(oneSecond);
      expect(mockCallback).toHaveBeenCalledTimes(2);

      rerender({pause: true});

      vi.advanceTimersByTime(fourSeconds);
      expect(mockCallback).not.toHaveBeenCalledTimes(3);
    });

    it('will restart from the paused position when toggled back and forth', () => {
      const mockCallback = vi.fn((difference) => difference);

      const {rerender} = renderHook(
        ({pause}: {pause: boolean}) =>
          useCountdown(mockCallback, mockTimeStart, pause),
        {initialProps: {pause: false}},
      );

      vi.advanceTimersByTime(halfSecond);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      rerender({pause: true});

      vi.advanceTimersByTime(fourSeconds);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      rerender({pause: false});

      vi.advanceTimersByTime(halfSecond);
      expect(mockCallback).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(oneSecond - 1);

      rerender({pause: true});

      vi.advanceTimersByTime(fourSeconds);
      expect(mockCallback).not.toHaveBeenCalledTimes(3);

      rerender({pause: false});

      vi.advanceTimersByTime(1);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });
});
