import React from 'react';
import {screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import {mountWithUser} from '../../test/utilities';
import {useOutsideClick} from '../useOutsideClick';
import {OutsideClickComponent} from './OutsideClickComponent';

describe('useOutsideClick', () => {
  describe('element', () => {
    it('does not register if element is not found', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();

      renderHook(() => useOutsideClick(null, mockCallback));

      await user.click(document.body);

      // TODO: We need a way to access `listAllEventListeners()`
      // so that we can actually check and see if something was registered.
      // Investigate what patterns exist in the current testing stack.
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('registers on the provided component', async () => {
      const mockOnAction = vi.fn();
      const mockOnOutsideClick = vi.fn();

      const {user} = mountWithUser(
        <OutsideClickComponent
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnAction).toHaveBeenCalledTimes(1);
      expect(mockOnOutsideClick).not.toHaveBeenCalled();

      const firstElement = screen.getByText(/first element/i);
      await user.click(firstElement);

      expect(mockOnAction).toHaveBeenCalledTimes(1);
      expect(mockOnOutsideClick).toHaveBeenCalledTimes(1);
    });

    it.todo('removes listener when element is removed from DOM');
  });

  describe('callback', () => {
    const mockOnAction = vi.fn();

    it('executes with mouse event', async () => {
      const mockOnOutsideClick = vi.fn();

      const {user} = mountWithUser(
        <OutsideClickComponent
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      const firstElement = screen.getByText(/first element/i);
      await user.click(firstElement);

      // TODO: Properly mock a `MouseEvent`.
      expect(mockOnOutsideClick).toHaveBeenCalledWith(
        expect.objectContaining({isTrusted: false}),
      );
    });
  });

  describe('options', () => {
    describe('disabled', () => {
      const mockOnAction = vi.fn();

      it('will not trigger callback when toggled', async () => {
        const mockOnOutsideClick = vi.fn();

        const {user, rerender} = mountWithUser(
          <OutsideClickComponent
            onAction={mockOnAction}
            onOutsideClick={mockOnOutsideClick}
          />,
        );

        const firstElement = screen.getByText(/first element/i);
        await user.click(firstElement);
        expect(mockOnOutsideClick).toHaveBeenCalledTimes(1);

        rerender(
          <OutsideClickComponent
            disabled
            onAction={mockOnAction}
            onOutsideClick={mockOnOutsideClick}
          />,
        );

        await user.click(firstElement);
        expect(mockOnOutsideClick).not.toHaveBeenCalledTimes(2);

        rerender(
          <OutsideClickComponent
            onAction={mockOnAction}
            onOutsideClick={mockOnOutsideClick}
          />,
        );

        await user.click(firstElement);
        expect(mockOnOutsideClick).toHaveBeenCalledTimes(2);
      });
    });

    describe('exclude', () => {
      const mockOnAction = vi.fn();

      it('will not trigger callback when click matches an excluded element', async () => {
        const mockOnOutsideClick = vi.fn();

        const {user} = mountWithUser(
          <OutsideClickComponent
            exclude
            onAction={mockOnAction}
            onOutsideClick={mockOnOutsideClick}
          />,
        );

        const firstElement = screen.getByText(/first element/i);
        await user.click(firstElement);

        expect(mockOnOutsideClick).not.toHaveBeenCalled();

        const lastElement = screen.getByText(/last element/i);
        await user.click(lastElement);

        expect(mockOnOutsideClick).not.toHaveBeenCalled();

        const outsideElement = screen.getByTestId('OutsideElement');
        await user.click(outsideElement);

        expect(mockOnOutsideClick).toHaveBeenCalledTimes(1);
      });
    });
  });
});
