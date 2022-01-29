import {useEffect, useLayoutEffect} from 'react';

import {canUseDom} from '../utilities';

// This "isomorphic" hook resolves to useEffect on the server
// and useLayoutEffect on the client.
export const useIsoLayoutEffect = canUseDom ? useLayoutEffect : useEffect;
