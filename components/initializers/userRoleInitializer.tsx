'use client';
import { useEffect } from 'react';
import { useRoleUserActions } from '@/stores/roleUserActions';
import { getSession } from '@/actions/auth';

export function UserRoleInitializer() {
  const { setUserRoleName } = useRoleUserActions();
  
  useEffect(() => {
    getSession()
      .then(result => {
        setUserRoleName(result.role);
      })
      .catch(() => {
        setUserRoleName('GUEST');
      });
  }, [setUserRoleName]);

  return null;
}
