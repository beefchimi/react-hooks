import React from 'react';

import {useIsoLayoutEffect} from '../useIsoLayoutEffect';

export interface IsoComponentProps {
  callback(): void;
  dependencyProp?: boolean;
}

export function IsoComponent({
  callback,
  dependencyProp = false,
}: IsoComponentProps) {
  useIsoLayoutEffect(callback, [dependencyProp]);

  return (
    <div className="IsoComponent">
      <p className="Text">Iso Component</p>
    </div>
  );
}
