import React from 'react';
import {screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import {mountWithUser} from '../../test/utilities';
import {useKeyPress} from '../useKeyPress';
import {KeyPressEventType} from '../types';
import type {KeyPressInput, KeyPressHookOptions} from '../types';
import {KeyPressComponent} from './KeyPressComponent';

interface KeysProps {
  keys: KeyPressInput;
}

describe('useKeyPress', () => {
  describe('keys', () => {
    it('executes the callback for all keys', async () => {
      const user = userEvent.setup();
      const mockKeys = ['1', '!', 'a', 'A', 'Enter'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      // Input is identical to the mocked keys.
      await user.keyboard('1!aA{enter}');

      expect(mockCallback).toHaveBeenCalledTimes(mockKeys.length);
    });

    it('executes the callback for only matched keys', async () => {
      const user = userEvent.setup();
      const mockKeys = ['2', '@', 'b', 'B', 'Escape'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      // Input does not include uppercase 'B'.
      await user.keyboard('2@b{Escape}');

      expect(mockCallback).toHaveBeenCalledTimes(mockKeys.length - 1);
    });

    it('executes the callback multiple times for identical keys', async () => {
      const user = userEvent.setup();
      const mockKeys = ['1', 'a', 'ShiftLeft'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      // TODO: This example previously used `ArrowRight`,
      // but resulted in a error. Worth investigating.
      // Input is: '1' x2, 'a' x3, 'ShiftLeft' x2
      await user.keyboard('11aaa{ShiftLeft}{ShiftLeft}');

      expect(mockCallback).toHaveBeenCalledTimes(7);
    });

    it('does not execute extraneous calls when duplicate keys are provided', async () => {
      const user = userEvent.setup();
      const mockKeys = ['1', '1', 'a', 'a'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      await user.keyboard('1ab');

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('re-registers the event listener when updated during lifecycle', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      const {rerender} = renderHook(
        ({keys}: KeysProps) => useKeyPress(keys, mockCallback),
        {initialProps: {keys: ['q', 'W', 'e']}},
      );

      await user.keyboard('qWe');
      expect(mockCallback).toHaveBeenCalledTimes(3);

      rerender({keys: ['z', 'X', 'c']});

      // Callback counter remains at the same count.
      await user.keyboard('qWe');
      expect(mockCallback).toHaveBeenCalledTimes(3);

      // Callback counter increases with updated key input.
      await user.keyboard('zXc');
      expect(mockCallback).toHaveBeenCalledTimes(6);
    });
  });

  describe('callback', () => {
    it('passes the event to the callback', async () => {
      const user = userEvent.setup();
      const mockKeys = ['a', 'b', 'c'];
      const mockCallback = vi.fn();

      renderHook(() => useKeyPress(mockKeys, mockCallback));

      await user.keyboard('a');

      // TODO: Properly mock a `KeyboardEvent`.
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({isTrusted: false}),
      );
    });
  });

  describe('options', () => {
    describe('eventType', () => {
      it('accepts `keypress`', async () => {
        const user = userEvent.setup();
        const mockKeys = ['a', 'b', 'c'];
        const mockCallback = vi.fn();

        renderHook(() =>
          useKeyPress(mockKeys, mockCallback, {
            eventType: KeyPressEventType.Press,
          }),
        );

        await user.keyboard('abc');

        expect(mockCallback).toHaveBeenCalledTimes(3);
      });

      it('accepts `keydown`', async () => {
        const user = userEvent.setup();
        const mockKeys = ['1', '2', '3'];
        const mockCallback = vi.fn();

        renderHook(() =>
          useKeyPress(mockKeys, mockCallback, {
            eventType: KeyPressEventType.Down,
          }),
        );

        await user.keyboard('123');

        expect(mockCallback).toHaveBeenCalledTimes(3);
      });
    });

    describe('target', () => {
      it.todo('does not register event if no `target` is found');

      // TODO: Figure out how to list registered event listeners.
      it.todo('registers on `document` by default');

      it('registers on the provided component', async () => {
        const mockKeys = ['a', 'b', 'c'];
        const mockCallback = vi.fn();

        const {user} = mountWithUser(
          <KeyPressComponent input={mockKeys} callback={mockCallback} />,
        );

        const buttonElement = screen.getByRole('button');
        await user.type(buttonElement, 'abc');

        expect(mockCallback).not.toHaveBeenCalled();

        const inputElement = screen.getByRole('textbox');

        expect(inputElement).toHaveValue('');
        await user.type(inputElement, 'abc');

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
      it('will prevent further input', async () => {
        const user = userEvent.setup();
        const mockKeys = ['a', 'b', 'c'];
        const mockCallback = vi.fn();

        const {rerender} = renderHook(
          ({disabled}: KeyPressHookOptions) =>
            useKeyPress(mockKeys, mockCallback, {disabled}),
          {initialProps: {disabled: undefined}},
        );

        await user.keyboard('abc');
        expect(mockCallback).toHaveBeenCalledTimes(3);

        rerender({disabled: true});

        await user.keyboard('abc');
        // Callback counter does not increase from previous count.
        expect(mockCallback).toHaveBeenCalledTimes(3);

        rerender({disabled: false});

        await user.keyboard('abc');
        // Callback counter resumes increasing.
        expect(mockCallback).toHaveBeenCalledTimes(6);
      });
    });
  });
});
