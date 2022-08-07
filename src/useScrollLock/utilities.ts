import {detectHasDom} from '../utilities';

import {isScrollbarWidthNumber} from './type-guards';
import {ScrollAxis} from './types';
import type {
  ScrollbarWidth,
  DefaultScrollLockOptions,
  ScrollLockCapturedProperties,
  OptionalTarget,
  RequiredTarget,
} from './types';

type TargetPadding = 'padding-right' | 'padding-bottom';

interface CapturedPropertiesCriteria {
  target: RequiredTarget;
  scrollAxis: DefaultScrollLockOptions['scrollAxis'];
  scrollbarWidth: ScrollbarWidth;
}

function getTargetPadding(target: RequiredTarget, padding: TargetPadding) {
  return detectHasDom()
    ? parseInt(window.getComputedStyle(target).getPropertyValue(padding), 10)
    : 0;
}

function getCapturedProperties({
  target,
  scrollAxis,
  scrollbarWidth,
}: CapturedPropertiesCriteria) {
  const verticalWidth = isScrollbarWidthNumber(scrollbarWidth)
    ? scrollbarWidth
    : scrollbarWidth[ScrollAxis.Vertical];

  const horizontalWidth = isScrollbarWidthNumber(scrollbarWidth)
    ? scrollbarWidth
    : scrollbarWidth[ScrollAxis.Horizontal];

  const captured: ScrollLockCapturedProperties = {
    scrollbarWidth: {
      [ScrollAxis.Vertical]: verticalWidth,
      [ScrollAxis.Horizontal]: horizontalWidth,
    },
  };

  // If there is no vertical or horizontal scrollbar,
  // we don't need to bother detecting and applying `padding`.

  if (verticalWidth === 0 && horizontalWidth === 0) {
    return captured;
  }

  if (scrollAxis === ScrollAxis.Vertical || scrollAxis === ScrollAxis.Both) {
    captured.paddingRight = getTargetPadding(target, 'padding-right');
    captured.appliedPaddingRight = captured.paddingRight + verticalWidth;
  }

  if (scrollAxis === ScrollAxis.Horizontal || scrollAxis === ScrollAxis.Both) {
    captured.paddingBottom = getTargetPadding(target, 'padding-bottom');
    captured.appliedPaddingBottom = captured.paddingBottom + horizontalWidth;
  }

  return captured;
}

///
/// Scrollbar measurements

export function guessScrollbarWidthVertical(target?: OptionalTarget) {
  if (!detectHasDom()) {
    return 0;
  }

  // `target` measurements do not account for `border` styles.
  return target
    ? target.offsetWidth - target.clientWidth
    : window.innerWidth - document.documentElement.clientWidth;
}

export function guessScrollbarWidthHorizontal(target?: OptionalTarget) {
  if (!detectHasDom()) {
    return 0;
  }

  // `target` measurements do not account for `border` styles.
  return target
    ? target.offsetHeight - target.clientHeight
    : window.innerHeight - document.documentElement.clientHeight;
}

///
/// DOM mutation (side-effects)

interface ResetScrollStylesCriteria {
  target: RequiredTarget;
  overflow: string;
  paddingRight: string;
  paddingBottom: string;
}

export function applyScrollStyles({
  target,
  scrollAxis,
  scrollbarWidth,
}: CapturedPropertiesCriteria) {
  const captured = getCapturedProperties({target, scrollAxis, scrollbarWidth});
  const {appliedPaddingRight, appliedPaddingBottom} = captured;

  if (appliedPaddingRight) {
    target.style.paddingRight = `${appliedPaddingRight}px`;
  }

  if (appliedPaddingBottom) {
    target.style.paddingBottom = `${appliedPaddingBottom}px`;
  }

  target.style.overflow = 'hidden';

  return captured;
}

export function resetScrollStyles({
  target,
  overflow,
  paddingRight,
  paddingBottom,
}: ResetScrollStylesCriteria) {
  target.style.overflow = overflow;
  target.style.paddingRight = paddingRight;
  target.style.paddingBottom = paddingBottom;
}
