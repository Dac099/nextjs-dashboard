import { create } from 'zustand';

type BoardConfiguration = {
  expandedGroups: boolean;
  setExpandedGroups: (expanded: boolean) => void;
  columnsWidth: Record<string, number>;
  setColumnWidth: (columnId: string, width: number) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
};

export const useBoardConfigurationStore = create<BoardConfiguration>((set) => ({
  expandedGroups: false,
  columnsWidth: {},
  showSidebar: true,
  setExpandedGroups: (expanded: boolean) => set({ expandedGroups: expanded }),
  setColumnWidth: (columnId: string, width: number) => set((state) => {
    const newColumnsWidth = {
      ...state.columnsWidth,
      [columnId]: width
    };
    return { columnsWidth: newColumnsWidth };
  }),
  setShowSidebar: (show: boolean) => set({ showSidebar: show }),
}));
