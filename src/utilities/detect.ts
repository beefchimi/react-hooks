export function detectHasDom() {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  );
}

export function detectIsAndroid() {
  return navigator?.userAgent ? /android/i.test(navigator.userAgent) : false;
}

export function detectIsIpad() {
  return (
    navigator?.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform)
  );
}

export function detectIsIos() {
  return navigator?.platform
    ? /iPad|iPhone|iPod/.test(navigator.platform) || detectIsIpad()
    : false;
}
