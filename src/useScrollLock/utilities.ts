import {detectHasDom} from '../utilities';

import {isScrollbarWidthNumber} from './type-guards';
import {ScrollAxis} from './types';
import type {
  ScrollbarWidth,
  DefaultScrollLockOptions,
  ScrollLockCapturedProperties,
  RequiredTarget,
} from './types';

interface TargetStyleCriteria {
  target: RequiredTarget;
  property: string;
}

function getTargetStyle({target, property}: TargetStyleCriteria) {
  return detectHasDom()
    ? parseInt(window.getComputedStyle(target).getPropertyValue(property), 10)
    : 0;
}

export function guessScrollbarWidthVertical() {
  // A better alternative might be:
  // (target || document.body).offsetWidth - (target || document.body).scrollWidth
  return detectHasDom()
    ? window.innerWidth - document.documentElement.clientWidth
    : 0;
}

export function guessScrollbarWidthHorizontal() {
  // A better alternative might be:
  // (target || document.body).offsetHeight - (target || document.body).scrollHeight
  return detectHasDom()
    ? window.innerHeight - document.documentElement.clientHeight
    : 0;
}

///
/// DOM mutation (side-effects)

interface ApplyScrollStylesCriteria {
  target: RequiredTarget;
  scrollAxis: DefaultScrollLockOptions['scrollAxis'];
  scrollbarWidth: ScrollbarWidth;
}

interface ResetScrollStylesCriteria {
  target: RequiredTarget;
  overflow: string;
  paddingRight: string;
  paddingBottom: string;
}

function applyScrollPadding({
  target,
  scrollAxis,
  scrollbarWidth,
}: ApplyScrollStylesCriteria) {
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

  if (scrollAxis === ScrollAxis.Vertical || scrollAxis === ScrollAxis.Both) {
    captured.paddingRight = getTargetStyle({
      target,
      property: 'padding-right',
    });
    captured.appliedPaddingRight = captured.paddingRight + verticalWidth;

    target.style.paddingRight = `${captured.appliedPaddingRight}px`;
  }

  if (scrollAxis === ScrollAxis.Horizontal || scrollAxis === ScrollAxis.Both) {
    captured.paddingBottom = getTargetStyle({
      target,
      property: 'padding-bottom',
    });
    captured.appliedPaddingBottom = captured.paddingBottom + horizontalWidth;

    target.style.paddingBottom = `${captured.appliedPaddingBottom}px`;
  }

  return captured;
}

export function applyScrollStyles({
  target,
  scrollAxis,
  scrollbarWidth,
}: ApplyScrollStylesCriteria) {
  target.style.overflow = 'hidden';
  return applyScrollPadding({target, scrollAxis, scrollbarWidth});
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
