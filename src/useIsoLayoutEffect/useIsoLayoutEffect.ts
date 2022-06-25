import {useEffect, useLayoutEffect} from 'react';

import {detectHasDom} from '../utilities';

// This "isomorphic" hook resolves to useEffect on the server
// and useLayoutEffect on the client.
export const useIsoLayoutEffect = detectHasDom() ? useLayoutEffect : useEffect;
