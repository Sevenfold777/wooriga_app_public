import {useQuery} from '@tanstack/react-query';
import {myProfile} from '../api/UsersApi';
import authStore from '../stores/AuthStore';

export default function useMe() {
  /** check is user has token */
  const hasToken = authStore.isLoggedIn;

  /** useQuery */
  const {data: me} = useQuery(['Me'], myProfile, {enabled: hasToken});

  /** useEffect: if no ME, loguserout */
  //   useEffect(() => {
  //     if (!me?.data) {
  //       authStore.logoutAction();
  //     }
  //   }, [me?.data]);

  return me?.data;
}
