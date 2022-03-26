import React from 'react';
import {screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import {mount} from '../../../test/utilities';
import {useEventListener} from '../useEventListener';
import {AllowedEvent, EventListenerComponent} from './EventListenerComponent';

describe('useEventListener', () => {
  describe('target', () => {
    it('does not register if element is not found', () => {
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener({
          eventType: AllowedEvent.KeyPress,
          callback: mockCallback,
          target: undefined,
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
          eventType: AllowedEvent.KeyPress,
          callback: mockCallback,
          target: document.body,
        }),
      );

      userEvent.keyboard('foo');

      // TODO: Test against what element the callback originated from.
      expect(mockCallback).toHaveBeenCalled();
    });

    it('registers on the provided component', () => {
      const mockCallback = vi.fn();
      mount(<EventListenerComponent callback={mockCallback} />);

      const button = screen.getByRole('button');
      userEvent.click(button);

      // TODO: Test against what element the callback originated from.
      expect(mockCallback).toHaveBeenCalled();
    });

    it('removes listener when unmounted', () => {
      const mockCallback = vi.fn();

      const {unmount} = renderHook(() =>
        useEventListener({
          eventType: AllowedEvent.KeyPress,
          callback: mockCallback,
          target: document.body,
        }),
      );

      unmount();

      userEvent.keyboard('foo');

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('removes listener when `target` changes', () => {
      const mockCallback = vi.fn();

      const {rerender} = mount(
        <EventListenerComponent callback={mockCallback} attachToDocument />,
      );

      userEvent.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      rerender(<EventListenerComponent callback={mockCallback} />);

      userEvent.click(document.body);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      const button = screen.getByRole('button');
      userEvent.click(button);

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('eventType', () => {
    it('registers the provided event', () => {
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener({
          eventType: AllowedEvent.Click,
          callback: mockCallback,
          target: document.body,
        }),
      );

      userEvent.click(document.body);

      expect(mockCallback).toHaveBeenCalled();
    });

    it('removes and re-applies listener when `eventType` changes', () => {
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({eventType}) =>
          useEventListener({
            eventType,
            callback: mockCallback,
            target: document.body,
          }),
        {initialProps: {eventType: AllowedEvent.Click}},
      );

      userEvent.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      rerender({eventType: AllowedEvent.KeyPress});

      userEvent.click(document.body);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      userEvent.keyboard('1');
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('callback', () => {
    it('is passed the event object', () => {
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener({
          eventType: AllowedEvent.Click,
          callback: mockCallback,
          target: document.body,
        }),
      );

      userEvent.click(document.body);

      // TODO: Properly mock a `MouseEvent`.
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({isTrusted: false}),
      );
    });

    it('removes and re-applies listener when `callback` changes', () => {
      const mockCallbackFirst = vi.fn();
      const mockCallbackSecond = vi.fn();

      const {rerender} = renderHook(
        ({callback}) =>
          useEventListener({
            eventType: AllowedEvent.Click,
            callback,
            target: document.body,
          }),
        {
          initialProps: {
            callback: mockCallbackFirst,
          },
        },
      );

      userEvent.click(document.body);
      expect(mockCallbackFirst).toHaveBeenCalledTimes(1);
      expect(mockCallbackSecond).not.toHaveBeenCalled();

      rerender({callback: mockCallbackSecond});

      userEvent.click(document.body);
      expect(mockCallbackFirst).not.toHaveBeenCalledTimes(2);
      expect(mockCallbackSecond).toHaveBeenCalledTimes(1);
    });
  });

  describe('options', () => {
    const mockOptions: AddEventListenerOptions = {
      capture: true,
      passive: true,
      once: true,
    };

    it('registers listener with the provided `options`', () => {
      const mockCallback = vi.fn();

      renderHook(() =>
        useEventListener({
          eventType: AllowedEvent.Click,
          callback: mockCallback,
          target: document.body,
          options: mockOptions,
        }),
      );

      userEvent.click(document.body);

      // TODO: Figure out how to inspect the registered listener for options.
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('removes and re-applies listener when an individual option changes', () => {
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({options}) =>
          useEventListener({
            eventType: AllowedEvent.Click,
            callback: mockCallback,
            target: document.body,
            options,
          }),
        {
          initialProps: {
            options: mockOptions,
          },
        },
      );

      userEvent.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      userEvent.click(document.body);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);

      rerender({options: {...mockOptions, once: false}});

      userEvent.click(document.body);
      userEvent.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });

  describe('disabled', () => {
    it('does not register when `true`', () => {
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({disabled}) =>
          useEventListener({
            eventType: AllowedEvent.Click,
            callback: mockCallback,
            target: document.body,
            disabled,
          }),
        {
          initialProps: {
            disabled: true,
          },
        },
      );

      userEvent.click(document.body);
      expect(mockCallback).not.toHaveBeenCalled();

      rerender({disabled: false});

      userEvent.click(document.body);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      rerender({disabled: true});

      userEvent.click(document.body);
      expect(mockCallback).not.toHaveBeenCalledTimes(2);
    });
  });

  // TODO: Figure out the best way to test this.
  describe('preferLayoutEffect', () => {
    it.todo('uses `useEffect` by default');

    it.todo('uses `useLayoutEffect` when `true`');
  });
});
