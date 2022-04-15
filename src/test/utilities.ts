import type {ReactElement} from 'react';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export function mount(component: ReactElement, options = {}) {
  return render(component, {
    // NOTE: Wrap provider(s) here if needed.
    wrapper: ({children}) => children,
    ...options,
  });
}

// TODO: Is it really worth keeping this separate from `mount()`?
// If we really want to avoid initializing `userEvent` when we don't need it,
// then we can simply include `userEvent?: boolean` in the `options`.
// TODO: Also, shall we do the same thing with `renderHook()`?
export function mountWithUser(component: ReactElement, options = {}) {
  const mountedComponent = mount(component, options);

  return {
    user: userEvent.setup(),
    ...mountedComponent,
  };
}
