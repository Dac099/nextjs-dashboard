import { create } from 'zustand';
import { Actions } from '@/utils/types/roles';

export type StoreType = {
    userActions: Actions[];
    userRoleName: string;
    setUserActions: (actions: Actions[]) => void;
    setUserRoleName: (roleName: string) => void;
}

export const useRoleUserActions = create<StoreType>((set) => ({
    userActions: [],
    setUserActions: (actions: Actions[]) => set({ userActions: actions }),
    userRoleName: '',
    setUserRoleName: (roleName: string) => set({ userRoleName: roleName }),
}));

