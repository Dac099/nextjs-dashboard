import { create } from 'zustand';

type BoardConfiguration = {
  expandedGroups: boolean;
  setExpandedGroups: (expanded: boolean) => void;
  columnsWidth: Record<string, number>;
  setColumnWidth: (columnId: string, width: number) => void;
};

export const useBoardConfigurationStore = create<BoardConfiguration>((set) => ({
  expandedGroups: false,
  setExpandedGroups: (expanded: boolean) => set({ expandedGroups: expanded }),
  columnsWidth: {},
  setColumnWidth: (columnId: string, width: number) => set((state) => {
    const newColumnsWidth = {
      ...state.columnsWidth,
      [columnId]: width
    };
    return { columnsWidth: newColumnsWidth };
  }),
}));