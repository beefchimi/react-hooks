import React from 'react';
import {screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import {mount} from '../../test/utilities';
import {useEventListener} from '../useEventListener';
import {EventListenerComponent} from './EventListenerComponent';

describe('useEventListener', () => {
  describe('target', () => {
    it('does not register if element is not found', () => {
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener({
          target: undefined,
          eventName: 'keypress',
          callback: mockCallback,
        }),
      );

      userEvent.keyboard('foo');

      // TODO: We need a way to access `listAllEventListeners()`
      // so that we can actually check and see if something was registered.
      // Investigate what patterns exist in the current testing stack.
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('registers on the provided element', () => {
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener({
          target: document.body,
          eventName: 'keypress',
          callback: mockCallback,
        }),
      );

      userEvent.keyboard('foo');

      expect(mockCallback).toHaveBeenCalled();
    });

    it('registers on the provided component', () => {
      const mockCallback = vi.fn();

      // TODO: Requires an immediate call to `rerender()` in order for
      // the hook to take effect (since it relies on a `ref`).
      const {rerender} = mount(
        <EventListenerComponent callback={mockCallback} />,
      );
      rerender(<EventListenerComponent callback={mockCallback} />);

      const button = screen.getByRole('button');
      userEvent.click(button);

      expect(mockCallback).toHaveBeenCalled();
    });

    it.todo('removes listener when element is removed from DOM');
  });

  describe('eventName', () => {
    it.todo('registers the provided event');

    it.todo('removes and re-applies listener when `eventName` changes');
  });

  describe('callback', () => {
    it.todo('executes when triggered');

    it.todo('is passed the event object');

    it.todo('removes and re-applies listener when `callback` changes');
  });

  describe('options', () => {
    it.todo('registers listener with the provided `options`');

    it.todo(
      'removes and re-applies listener when an individual option changes',
    );
  });

  describe('disabled', () => {
    it.todo('does not register when `true`');

    it.todo('registers listener when `disabled` changes');
  });

  describe('preferLayoutEffect', () => {
    it.todo('uses `useEffect` by default');

    it.todo('uses `useLayoutEffect` when `true`');
  });
});
