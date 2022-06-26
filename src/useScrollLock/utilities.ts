import {detectHasDom} from '../utilities';

export function guessScrollbarWidth() {
  // A better alternative might be:
  // (target || document.body).offsetWidth - (target || document.body).scrollWidth
  return detectHasDom()
    ? window.innerWidth - document.documentElement.clientWidth
    : 0;
}

export function getPaddingRight(target = document?.body) {
  return detectHasDom() && target
    ? parseInt(
        window.getComputedStyle(target).getPropertyValue('padding-right'),
        10,
      )
    : 0;
}
