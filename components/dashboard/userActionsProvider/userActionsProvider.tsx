'use client';

import { useEffect } from 'react';
import { useRoleUserActions } from '@/stores/roleUserActions';
import { Actions } from '@/utils/types/roles';

type UserActionsProviderProps = {
  allowedUserActions: Actions[];
};

/**
 * Este componente recibe las acciones permitidas del usuario y las almacena en el store global
 * para que estén disponibles en toda la aplicación.
 */
export const UserActionsProvider = ({ allowedUserActions }: UserActionsProviderProps) => {
  const { setUserActions } = useRoleUserActions();

  useEffect(() => {
    // Almacena las acciones permitidas en el store global cuando el componente se monta
    // o cuando las acciones cambian
    setUserActions(allowedUserActions);

    // No es necesario una limpieza porque no queremos perder las acciones cuando
    // el componente se desmonte
  }, [allowedUserActions, setUserActions]);

  // Este componente no renderiza nada visible, solo se encarga de sincronizar datos
  return null;
};
