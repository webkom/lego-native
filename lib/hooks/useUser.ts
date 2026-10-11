import { useAtomValue } from 'jotai/react';
import { userAtom, type User } from '../atoms/user-atom';

export const isWebkomMember = (user?: Partial<User> | null): boolean => {
  if (!user) return false;

  // Direct username check (e.g. dev/admin test account)
  if (user.username?.toLowerCase() === 'webkom') {
    return true;
  }

  // Check abakusGroups
  if (Array.isArray(user.abakusGroups)) {
    const inGroups = user.abakusGroups.some((group: unknown) => {
      if (typeof group === 'number') {
        return group === 11 || group === 12;
      }
      if (typeof group === 'string') {
        return group.toLowerCase() === 'webkom';
      }
      if (typeof group === 'object' && group !== null) {
        const g = group as { id?: number; name?: string };
        return g.id === 11 || g.id === 12 || g.name?.toLowerCase() === 'webkom';
      }
      return false;
    });
    if (inGroups) return true;
  }

  // Check memberships
  if (Array.isArray(user.memberships)) {
    const inMemberships = user.memberships.some((m: unknown) => {
      if (typeof m === 'object' && m !== null) {
        const mem = m as { abakusGroup?: number; isActive?: boolean };
        return (mem.abakusGroup === 11 || mem.abakusGroup === 12) && mem.isActive !== false;
      }
      return false;
    });
    if (inMemberships) return true;
  }

  return false;
};

export const useUser = () => {
  const user = useAtomValue(userAtom);

  // Calculate the user class
  const grade = user?.abakusGroups?.find((group) => group.type === 'klasse');
  const isWebkom = isWebkomMember(user);

  return { ...user, grade: grade?.name, isWebkom };
};
