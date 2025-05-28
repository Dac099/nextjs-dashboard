import { create } from 'zustand';

type BoardConfiguration = {
  expandedGroups: boolean;
  setExpandedGroups: (expanded: boolean) => void;
};

export const useBoardConfigurationStore = create<BoardConfiguration>((set) => ({
  expandedGroups: false,
  setExpandedGroups: (expanded: boolean) => set({ expandedGroups: expanded }),
}));