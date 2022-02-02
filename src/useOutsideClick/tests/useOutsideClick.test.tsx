import React from 'react';
import {screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import {mount} from '../../test/utilities';
import {useOutsideClick} from '../useOutsideClick';
import {OutsideClickComponent} from './OutsideClickComponent';

describe('useOutsideClick', () => {
  describe('element', () => {
    it('does not register if element is not found', () => {
      const mockCallback = vi.fn();

      renderHook(() => useOutsideClick(null, mockCallback));

      userEvent.click(document.body);

      // TODO: We need a way to access `listAllEventListeners()`
      // so that we can actually check and see if something was registered.
      // Investigate what patterns exist in the current testing stack.
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('registers on the provided component', () => {
      const mockOnAction = vi.fn();
      const mockOnOutsideClick = vi.fn();

      const {rerender} = mount(
        <OutsideClickComponent
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      // TODO: Requires an immediate call to `rerender()` in order for
      // the hook to take effect (since it relies on a `ref`).
      rerender(
        <OutsideClickComponent
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      const button = screen.getByRole('button');
      userEvent.click(button);

      expect(mockOnAction).toHaveBeenCalledOnce();
      expect(mockOnOutsideClick).not.toHaveBeenCalled();

      const outsideElement = screen.getByText(/first element/i);
      userEvent.click(outsideElement);

      expect(mockOnAction).toHaveBeenCalledOnce();
      expect(mockOnOutsideClick).toHaveBeenCalledOnce();
    });

    it.todo('removes listener when element is removed from DOM');
  });

  describe('callback', () => {
    const mockOnAction = vi.fn();

    it('executes with mouse event', () => {
      const mockOnOutsideClick = vi.fn();

      const {rerender} = mount(
        <OutsideClickComponent
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      // TODO: Requires an immediate call to `rerender()` in order for
      // the hook to take effect (since it relies on a `ref`).
      rerender(
        <OutsideClickComponent
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      const outsideElement = screen.getByText(/first element/i);
      userEvent.click(outsideElement);

      // TODO: Properly mock a `MouseEvent`.
      expect(mockOnOutsideClick).toHaveBeenCalledWith(
        expect.objectContaining({isTrusted: false}),
      );
    });
  });

  describe('exclude', () => {
    const mockOnAction = vi.fn();

    it('will not trigger outside click', () => {
      const mockOnOutsideClick = vi.fn();

      const {rerender} = mount(
        <OutsideClickComponent
          exclude
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      // TODO: Requires an immediate call to `rerender()` in order for
      // the hook to take effect (since it relies on a `ref`).
      rerender(
        <OutsideClickComponent
          exclude
          onAction={mockOnAction}
          onOutsideClick={mockOnOutsideClick}
        />,
      );

      const outsideElement = screen.getByText(/last element/i);
      userEvent.click(outsideElement);

      expect(mockOnOutsideClick).not.toHaveBeenCalled();
    });
  });
});
