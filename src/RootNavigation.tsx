import {createNavigationContainerRef} from '@react-navigation/native';
import {RootParams, SignedInParams} from './navigators/types';

export const navigationRef = createNavigationContainerRef<RootParams>();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// add other navigation functions that you need and export them
