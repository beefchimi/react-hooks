import {detectHasDom} from '../utilities';

import {ScrollAxis} from './types';
import type {
  DefaultScrollLockOptions,
  ScrollLockOptions,
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

export function guessScrollbarWidth() {
  // A better alternative might be:
  // (target || document.body).offsetWidth - (target || document.body).scrollWidth
  return detectHasDom()
    ? window.innerWidth - document.documentElement.clientWidth
    : 0;
}

///
/// DOM mutation (side-effects)

interface ApplyScrollStylesCriteria {
  target: RequiredTarget;
  scrollAxis: DefaultScrollLockOptions['scrollAxis'];
  scrollbarWidth: NonNullable<ScrollLockOptions['scrollbarOffset']>;
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
  const captured: ScrollLockCapturedProperties = {scrollbarWidth};

  if (scrollAxis === ScrollAxis.Vertical || scrollAxis === ScrollAxis.Both) {
    captured.paddingRight = getTargetStyle({
      target,
      property: 'padding-right',
    });
    captured.appliedPaddingRight = captured.paddingRight + scrollbarWidth;

    target.style.paddingRight = `${captured.appliedPaddingRight}px`;
  }

  if (scrollAxis === ScrollAxis.Horizontal || scrollAxis === ScrollAxis.Both) {
    captured.paddingBottom = getTargetStyle({
      target,
      property: 'padding-bottom',
    });
    captured.appliedPaddingBottom = captured.paddingBottom + scrollbarWidth;

    target.style.paddingBottom = `${
      captured.appliedPaddingBottom + scrollbarWidth
    }px`;
  }

  return captured;
}

export function applyScrollStyles({
  target,
  scrollAxis,
  scrollbarWidth,
}: ApplyScrollStylesCriteria) {
  target.style.overflow = 'hidden';

  return scrollbarWidth
    ? applyScrollPadding({target, scrollAxis, scrollbarWidth})
    : {};
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
