import {ScrollAxis} from './types';
import type {ScrollbarWidth, ScrollbarWidthDualAxis} from './types';

export function isScrollbarWidthNumber(value: ScrollbarWidth): value is number {
  return Number.isFinite(value);
}

export function isScrollbarWidthDualAxis(
  value: ScrollbarWidth,
): value is ScrollbarWidthDualAxis {
  return (
    Object.prototype.hasOwnProperty.call(value, ScrollAxis.Vertical) &&
    Object.prototype.hasOwnProperty.call(value, ScrollAxis.Horizontal)
  );
}
