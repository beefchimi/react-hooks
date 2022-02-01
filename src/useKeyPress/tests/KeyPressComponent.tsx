import React, {useRef, useState} from 'react';
import type {ChangeEventHandler} from 'react';

import {noop} from '../../utilities';
import {useKeyPress} from '../useKeyPress';
import {KeyPressEventType} from '../types';
import type {KeyPressCallback, KeyPressInput} from '../types';

export interface KeyPressComponentProps {
  input: KeyPressInput;
  callback: KeyPressCallback;
}

const LABEL_ID = 'ExampleLabel';
const INPUT_ID = 'ExampleInput';

export function KeyPressComponent({input, callback}: KeyPressComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [value, setValue] = useState('');

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
  };

  useKeyPress(input, callback, {
    eventType: KeyPressEventType.Up,
    target: inputRef.current,
  });

  // TODO: The eslint-ing for this `label + input` combo seems overboard.
  // https://github.com/beefchimi/dev-configs/issues/48
  return (
    <div className="KeyPressComponent">
      <button ref={buttonRef} type="button" onClick={noop}>
        Sibling action
      </button>

      <label id={LABEL_ID} htmlFor={INPUT_ID}>
        <input
          ref={inputRef}
          type="text"
          id={INPUT_ID}
          aria-labelledby={LABEL_ID}
          value={value}
          onChange={handleOnChange}
        />
      </label>
    </div>
  );
}
