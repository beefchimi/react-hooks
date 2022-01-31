import React from 'react';
// import {act} from 'react-test-renderer';
import type {ReactTestRenderer} from 'react-test-renderer';
// import type vitestTypes from 'vitest';

import {mount} from '../../utilities';
import {EventListenerComponent} from './EventListenerComponent';

describe('useEventListener', () => {
  describe('target', () => {
    // TODO: This is just a placeholder test.
    it('registers on the provided element', () => {
      const mockCallback = vi.fn();

      const wrapper = mount(<EventListenerComponent callback={mockCallback} />);
      const button = getButton(wrapper);

      expect(mockCallback).not.toHaveBeenCalled();
      expect(button).not.toBeNull();
    });

    it.todo('does not register if element is not found');

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

function getButton(wrapper: ReactTestRenderer) {
  return wrapper.root.findByType('button');
}
