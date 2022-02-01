import React from 'react';
import {screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import {mount} from '../../test/utilities';
import {useKeyPress} from '../useKeyPress';
import {KeyPressEventType} from '../types';
import type {KeyPressInput, KeyPressOptions} from '../types';
import {KeyPressComponent} from './KeyPressComponent';

interface KeysProps {
  keys: KeyPressInput;
}

describe('useKeyPress', () => {
  describe('keys', () => {
    it('executes the callback for all keys', () => {
      const mockKeys = ['1', '!', 'a', 'A', 'Enter'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      // Input is identical to the mocked keys.
      userEvent.keyboard('1!aA{enter}');

      expect(mockCallback).toHaveBeenCalledTimes(mockKeys.length);
    });

    it('executes the callback for only matched keys', () => {
      const mockKeys = ['2', '@', 'b', 'B', 'Escape'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      // Input does not include uppercase 'B'.
      userEvent.keyboard('2@b{esc}');

      expect(mockCallback).toHaveBeenCalledTimes(mockKeys.length - 1);
    });

    it('executes the callback multiple times for identical keys', () => {
      const mockKeys = ['1', 'a', 'ArrowRight'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      // Input is: '1' x2, 'a' x3, '→' x2
      userEvent.keyboard('11aaa{arrowright}{arrowright}');

      expect(mockCallback).toHaveBeenCalledTimes(7);
    });

    it('does not execute extraneous calls when duplicate keys are provided', () => {
      const mockKeys = ['1', '1', 'a', 'a'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      userEvent.keyboard('1ab');

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('re-registers the event listener when updated during lifecycle', () => {
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({keys}: KeysProps) => useKeyPress(keys, mockCallback),
        {initialProps: {keys: ['q', 'W', 'e']}},
      );

      userEvent.keyboard('qWe');
      expect(mockCallback).toHaveBeenCalledTimes(3);

      rerender({keys: ['z', 'X', 'c']});

      // Callback counter remains at the same count.
      userEvent.keyboard('qWe');
      expect(mockCallback).toHaveBeenCalledTimes(3);

      // Callback counter increases with updated key input.
      userEvent.keyboard('zXc');
      expect(mockCallback).toHaveBeenCalledTimes(6);
    });
  });

  describe('callback', () => {
    it('passes the event to the callback', () => {
      const mockKeys = ['a', 'b', 'c'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      userEvent.keyboard('a');

      // TODO: Properly mock a `KeyboardEvent`.
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({isTrusted: false}),
      );
    });
  });

  describe('options', () => {
    describe('eventType', () => {
      it('accepts `keypress`', () => {
        const mockKeys = ['a', 'b', 'c'];
        const mockCallback = vi.fn();

        renderHook(() =>
          useKeyPress(mockKeys, mockCallback, {
            eventType: KeyPressEventType.Press,
          }),
        );

        userEvent.keyboard('abc');

        expect(mockCallback).toHaveBeenCalledTimes(3);
      });

      it('accepts `keydown`', () => {
        const mockKeys = ['1', '2', '3'];
        const mockCallback = vi.fn();

        renderHook(() =>
          useKeyPress(mockKeys, mockCallback, {
            eventType: KeyPressEventType.Down,
          }),
        );

        userEvent.keyboard('123');

        expect(mockCallback).toHaveBeenCalledTimes(3);
      });
    });

    describe('target', () => {
      it.todo('does not register event if no `target` is found');

      // TODO: Figure out how to list registered event listeners.
      it.todo('registers on `document` by default');

      it('registers on the provided component', () => {
        const mockKeys = ['a', 'b', 'c'];
        const mockCallback = vi.fn();

        const {rerender} = mount(
          <KeyPressComponent input={mockKeys} callback={mockCallback} />,
        );

        // TODO: Requires an immediate `rerender()` for the updated ref.
        // https://github.com/beefchimi/react-hooks/issues/20
        rerender(
          <KeyPressComponent input={mockKeys} callback={mockCallback} />,
        );

        const buttonElement = screen.getByRole('button');
        userEvent.type(buttonElement, 'abc');

        expect(mockCallback).not.toHaveBeenCalled();

        const inputElement = screen.getByRole('textbox');

        expect(inputElement).toHaveValue('');
        userEvent.type(inputElement, 'abc');

        expect(mockCallback).toHaveBeenCalledTimes(3);
        expect(inputElement).toHaveValue('abc');
      });

      // TODO: Figure out how to list registered event listeners.
      it.todo('removes listener when hook is unmounted');

      // TODO: Consider a test that switches from one `input` to another,
      // (could use a `input > checkbox + state` to perform the toggle)
      // and check that the hook removes the listener from the original input,
      // and applies it to the new one.
    });

    describe('disabled', () => {
      it('will prevent further input', () => {
        const mockKeys = ['a', 'b', 'c'];
        const mockCallback = vi.fn();

        const {rerender} = renderHook(
          ({disabled}: KeyPressOptions) =>
            useKeyPress(mockKeys, mockCallback, {disabled}),
          {initialProps: {disabled: undefined}},
        );

        userEvent.keyboard('abc');
        expect(mockCallback).toHaveBeenCalledTimes(3);

        rerender({disabled: true});

        userEvent.keyboard('abc');
        // Callback counter does not increase from previous count.
        expect(mockCallback).toHaveBeenCalledTimes(3);

        rerender({disabled: false});

        userEvent.keyboard('abc');
        // Callback counter resumes increasing.
        expect(mockCallback).toHaveBeenCalledTimes(6);
      });
    });
  });
});
