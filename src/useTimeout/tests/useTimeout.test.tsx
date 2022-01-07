import React from 'react';
import renderer from 'react-test-renderer';
import {ExampleHookComponent} from './ExampleHookComponent';
import type {ExampleHookComponentProps} from './ExampleHookComponent';

describe('useTimeout', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const mockPreValue = 'foo';
  const mockPostValue = 'bar';
  const mockDuration = 100;

  const defaultProps: ExampleHookComponentProps = {
    preTimeoutValue: mockPreValue,
    postTimeoutValue: mockPostValue,
    duration: mockDuration,
  };

  describe('ExampleHookComponent', () => {
    test('Renders `postTimeoutValue` after timeout has expired', () => {
      const component = renderer.create(
        <ExampleHookComponent {...defaultProps} />,
      );

      // For snapshot testing:
      // const componentTree = component.toJSON();
      // expect(componentTree).toMatchSnapshot();

      expect(getChildElement(component).children).toEqual([mockPreValue]);
      vi.advanceTimersByTime(mockDuration);
      expect(getChildElement(component).children).toEqual([mockPostValue]);
    });

    test('Does not render `postTimeoutValue` before the timeout has expired', () => {
      const component = renderer.create(
        <ExampleHookComponent {...defaultProps} />,
      );

      expect(getChildElement(component).children).toEqual([mockPreValue]);
      vi.advanceTimersByTime(mockDuration - 1);
      expect(getChildElement(component).children).toEqual([mockPreValue]);
    });
  });
});

function getChildElement(component: renderer.ReactTestRenderer) {
  return component.root.findByProps({className: 'Child'});
}
