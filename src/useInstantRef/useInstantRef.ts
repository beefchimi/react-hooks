import {useCallback, useState} from 'react';

type InstantRefValue<T> = T | null;

type InstantRefHookReturn<T> = [
  InstantRefValue<T>,
  (value: InstantRefValue<T>) => void,
];

// This hook promotes a React anti-pattern, but I've yet to
// find a more eloquent solution for when you need to share
// the ref between multiple hooks/effects (as opposed to
// being isolated to a single `callback -> update` pattern).
// If you are using multiple refs within a single component,
// prefer using this hook only once (for whatever ref has
// the highest priority). Since this hook forces a re-render,
// all other calls to `useRef()` will receive their definition
// as a result of this hooks re-render.

// A demonstration of this hook's purpose can be found here:
// https://codesandbox.io/s/element-ref-hooks-p8cgy?file=/src/App.tsx
// https://codesandbox.io/s/testing-ref-and-hooks-0xeyr?file=/src/App.tsx

export function useInstantRef<T>(): InstantRefHookReturn<T> {
  const [currentValue, setCurrentValue] = useState<InstantRefValue<T>>(null);

  const setRef = useCallback(
    (value: InstantRefValue<T>) => setCurrentValue(value),
    [],
  );

  return [currentValue, setRef];
}
