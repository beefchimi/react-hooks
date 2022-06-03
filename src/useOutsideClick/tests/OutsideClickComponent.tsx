import React, {useRef} from 'react';

import {useInstantRef} from '../../useInstantRef';
import {useOutsideClick} from '../useOutsideClick';
import type {OutsideClickCallback} from '../types';

export interface OutsideClickComponentProps {
  onAction(): void;
  onOutsideClick: OutsideClickCallback;
  disabled?: boolean;
  exclude?: boolean;
}

export function OutsideClickComponent({
  onAction,
  onOutsideClick,
  disabled = false,
  exclude = false,
}: OutsideClickComponentProps) {
  const [buttonElement, buttonRef] = useInstantRef<HTMLButtonElement>();

  const firstElementRef = useRef<HTMLHeadingElement>(null);
  const lastElementRef = useRef<HTMLParagraphElement>(null);

  useOutsideClick(buttonElement, onOutsideClick, {
    disabled,
    exclude: exclude
      ? [firstElementRef.current, lastElementRef.current]
      : undefined,
  });

  return (
    <div className="OutsideClickComponent">
      <h1 ref={firstElementRef}>First element</h1>

      <button ref={buttonRef} type="button" onClick={onAction}>
        Outside Event Component
      </button>

      <div data-testid="OutsideElement">
        <p>
          This outside element is omitted from the <code>exclude</code> prop,
          and therefor will trigger the <code>onOutsideClick()</code> callback.
        </p>
      </div>

      <p ref={lastElementRef}>Last element</p>
    </div>
  );
}
