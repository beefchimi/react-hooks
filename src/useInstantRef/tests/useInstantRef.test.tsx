import React from 'react';
import {screen} from '@testing-library/react';

import {mount} from '../../test/utilities';
import {InstantRefComponent} from './InstantRefComponent';
import {NormalRefComponent} from './NormalRefComponent';

describe('useInstantRef', () => {
  it('immediately triggers a re-render and defines a value', () => {
    const mockOnFocus = vi.fn();
    mount(<InstantRefComponent onFocus={mockOnFocus} />);

    const buttonElement = screen.getByRole('button');

    expect(mockOnFocus).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(buttonElement);
  });

  describe('useRef', () => {
    it('does not hold a reference to a DOM node on first render', () => {
      const mockOnFocus = vi.fn();
      mount(<NormalRefComponent onFocus={mockOnFocus} />);

      const buttonElement = screen.getByRole('button');

      expect(mockOnFocus).not.toHaveBeenCalled();
      expect(document.activeElement).not.toBe(buttonElement);
    });

    it('will reference a DOM node once rerendered', () => {
      const mockOnFocus = vi.fn();
      const {rerender} = mount(<NormalRefComponent onFocus={mockOnFocus} />);

      rerender(<NormalRefComponent onFocus={mockOnFocus} />);

      const buttonElement = screen.getByRole('button');

      expect(mockOnFocus).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(buttonElement);
    });
  });
});
