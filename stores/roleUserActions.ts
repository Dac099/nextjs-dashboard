import { create } from 'zustand';
import { Actions } from '@/utils/types/roles';

export type StoreType = {
    userActions: Actions[];
    setUserActions: (actions: Actions[]) => void;
}

export const useRoleUserActions = create<StoreType>((set) => ({
    userActions: [],
    setUserActions: (actions: Actions[]) => set({ userActions: actions }),
}));

