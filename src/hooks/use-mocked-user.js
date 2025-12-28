import { useAuth } from './use-auth';

export const useMockedUser = () => {
  const { user } = useAuth();
  return user;
};
