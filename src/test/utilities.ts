import type {ReactElement} from 'react';
import {render} from '@testing-library/react';

export function mount(component: ReactElement, options = {}) {
  return render(component, {
    // NOTE: Wrap provider(s) here if needed.
    wrapper: ({children}) => children,
    ...options,
  });
}
