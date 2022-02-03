import {useEffect} from 'react';

// This is a contrived example, but effectively demonstrates the problem.
// The code within the `useEffect` that relies on a `ref.current > DOM node`
// will not be executed on initial render until React has re-rendered
// to store reference to that DOM node.

// If this `useEffect()` were pulled out of this custom hook
// and used directly in the component, React actually would
// work as expected. I am unsure of the exact mechanic that
// leads to this problem.
export function useFocusEffect(element: HTMLElement | null) {
  useEffect(() => {
    element?.focus();
  }, [element]);
}
