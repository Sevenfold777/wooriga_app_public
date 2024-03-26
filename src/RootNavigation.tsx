import {createNavigationContainerRef} from '@react-navigation/native';
import {RootParams, SignedInParams} from './navigators/types';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
