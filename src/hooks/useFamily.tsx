import {useQuery} from '@tanstack/react-query';
import {findMyFamilyApi} from '../api/FamilyApi';
import authStore from '../stores/AuthStore';

export default function useFamily(exceptMe = false) {
  /** check is user has token */
  const hasToken = authStore.isLoggedIn;

  /** useQuery */
  const {data: myFamily} = useQuery(
    ['MyFamily', exceptMe],
    () => findMyFamilyApi(exceptMe),
    {
      enabled: hasToken,
    },
  );

  return myFamily?.data;
}
