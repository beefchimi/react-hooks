import React from 'react';
import {screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import {mountWithUser} from '../../test/utilities';
import {useEventListener} from '../useEventListener';
import type {SupportedEventListenerOptions} from '../types';
import {AllowedEvent, EventListenerComponent} from './EventListenerComponent';

describe('useEventListener', () => {
  describe('target', () => {
    it('does not register if element is not found', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener(undefined, AllowedEvent.KeyPress, mockCallback),
      );

      await user.keyboard('foo');

      // TODO: We need a way to access `listAllEventListeners()`
      // so that we can actually check and see if something was registered.
      // Investigate what patterns exist in the current testing stack.
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('registers on the provided element', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener(document.body, AllowedEvent.KeyPress, mockCallback),
      );

      await user.keyboard('foo');

      // TODO: Test against what element the callback originated from.
      expect(mockCallback).toHaveBeenCalled();
    });

    it('registers on the provided component', async () => {
      const mockCallback = vi.fn();
      const {user} = mountWithUser(
        <EventListenerComponent callback={mockCallback} />,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      // TODO: Test against what element the callback originated from.
      expect(mockCallback).toHaveBeenCalled();
    });

    it('removes listener when unmounted', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      const {unmount} = renderHook(() =>
        useEventListener(document.body, AllowedEvent.KeyPress, mockCallback),
      );

      unmount();

      await user.keyboard('foo');

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('removes listener when `target` changes', async () => {
      const mockCallback = vi.fn();

      const {user, rerender} = mountWithUser(
        <EventListenerComponent callback={mockCallback} attachToDocument />,
      );

      await user.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      rerender(<EventListenerComponent callback={mockCallback} />);

      await user.click(document.body);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('eventType', () => {
    it('registers the provided event', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener(document.body, AllowedEvent.Click, mockCallback),
      );

      await user.click(document.body);

      expect(mockCallback).toHaveBeenCalled();
    });

    it('removes and re-applies listener when `eventType` changes', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({eventType}) =>
          useEventListener(document.body, eventType, mockCallback),
        {initialProps: {eventType: AllowedEvent.Click}},
      );

      await user.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      rerender({eventType: AllowedEvent.KeyPress});

      await user.click(document.body);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      await user.keyboard('1');
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('callback', () => {
    it('is passed the event object', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener(document.body, AllowedEvent.Click, mockCallback),
      );

      await user.click(document.body);

      // TODO: Properly mock a `MouseEvent`.
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({isTrusted: false}),
      );
    });

    it('removes and re-applies listener when `callback` changes', async () => {
      const user = userEvent.setup();
      const mockCallbackFirst = vi.fn();
      const mockCallbackSecond = vi.fn();

      const {rerender} = renderHook(
        ({callback}) =>
          useEventListener(document.body, AllowedEvent.Click, callback),
        {
          initialProps: {
            callback: mockCallbackFirst,
          },
        },
      );

      await user.click(document.body);
      expect(mockCallbackFirst).toHaveBeenCalledTimes(1);
      expect(mockCallbackSecond).not.toHaveBeenCalled();

      rerender({callback: mockCallbackSecond});

      await user.click(document.body);
      expect(mockCallbackFirst).not.toHaveBeenCalledTimes(2);
      expect(mockCallbackSecond).toHaveBeenCalledTimes(1);
    });
  });

  describe('options', () => {
    describe('disabled', () => {
      it('does not register when `true`', async () => {
        const user = userEvent.setup();
        const mockCallback = vi.fn();

        const {rerender} = renderHook(
          ({disabled}) =>
            useEventListener(document.body, AllowedEvent.Click, mockCallback, {
              disabled,
            }),
          {
            initialProps: {
              disabled: true,
            },
          },
        );

        await user.click(document.body);
        expect(mockCallback).not.toHaveBeenCalled();

        rerender({disabled: false});

        await user.click(document.body);
        expect(mockCallback).toHaveBeenCalledTimes(1);

        rerender({disabled: true});

        await user.click(document.body);
        expect(mockCallback).not.toHaveBeenCalledTimes(2);
      });
    });

    // TODO: Figure out the best way to test this.
    describe('preferLayoutEffect', () => {
      it.todo('uses `useEffect` by default');

      it.todo('uses `useLayoutEffect` when `true`');
    });
  });

  describe('listenerOptions', () => {
    const mockListenerOptions: SupportedEventListenerOptions = {
      capture: true,
      passive: true,
      once: true,
    };

    it('registers listener with the provided `listenerOptions`', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener(
          document.body,
          AllowedEvent.Click,
          mockCallback,
          {},
          mockListenerOptions,
        ),
      );

      await user.click(document.body);

      // TODO: Figure out how to inspect the registered listener for options.
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('removes and re-applies listener when an individual option changes', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({options}) =>
          useEventListener(
            document.body,
            AllowedEvent.Click,
            mockCallback,
            {},
            options,
          ),
        {
          initialProps: {
            options: mockListenerOptions,
          },
        },
      );

      await user.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      await user.click(document.body);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      rerender({options: {...mockListenerOptions, once: false}});

      await user.click(document.body);
      await user.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });
});
