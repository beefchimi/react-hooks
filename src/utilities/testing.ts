import {act, create} from 'react-test-renderer';
import type {ReactTestRenderer} from 'react-test-renderer';

type CreateArgs = Parameters<typeof create>;
type Component = CreateArgs[0];
type Options = CreateArgs[1];

export function mount(component: Component, options?: Options) {
  let wrapper: ReactTestRenderer | undefined;

  act(() => {
    wrapper = create(component, options);
  });

  // TODO: Figure out how to avoid this typecast.
  // We may need to make this function async/await.
  return wrapper as ReactTestRenderer;
}
