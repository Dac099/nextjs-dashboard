import { GroupData, ItemData, ItemValue, ColumnData } from '@/utils/types/views';
import { create } from 'zustand';

interface BoardDataState {
  // Estado
  groups: GroupData[];
  columns: ColumnData[];
  
  // Operaciones para Groups
  setGroups: (groups: GroupData[]) => void;
  addGroup: (group: GroupData) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (groupId: string, updates: Partial<Omit<GroupData, 'id' | 'items'>>) => void;
  
  // Operaciones para Items dentro de Groups
  addItemToGroup: (groupId: string, item: ItemData) => void;
  removeItemFromGroup: (groupId: string, itemId: string) => void;
  updateItemInGroup: (groupId: string, itemId: string, updates: Partial<Omit<ItemData, 'id' | 'values'>>) => void;
  
  // Operaciones para ItemValues dentro de Items
  addValueToItem: (groupId: string, itemId: string, value: ItemValue) => void;
  removeValueFromItem: (groupId: string, itemId: string, valueId: string) => void;
  updateValueInItem: (groupId: string, itemId: string, valueId: string, updates: Partial<Omit<ItemValue, 'id'>>) => void;
  
  // Operaciones para Columns
  setColumns: (columns: ColumnData[]) => void;
  addColumn: (column: ColumnData) => void;
  removeColumn: (columnId: string) => void;
  updateColumn: (columnId: string, updates: Partial<Omit<ColumnData, 'id'>>) => void;
  
  // Helpers
  getGroupById: (groupId: string) => GroupData | undefined;
  getItemById: (groupId: string, itemId: string) => ItemData | undefined;
  getValueById: (groupId: string, itemId: string, valueId: string) => ItemValue | undefined;
  getColumnById: (columnId: string) => ColumnData | undefined;
}

export const useBoardDataStore = create<BoardDataState>((set, get) => ({
  // Estado inicial
  groups: [],
  columns: [],
  
  // Operaciones para Groups
  setGroups: (groups) => set({ groups }),
  
  addGroup: (group) => set((state) => ({
    groups: [...state.groups, group]
  })),
  
  removeGroup: (groupId) => set((state) => ({
    groups: state.groups.filter(group => group.id !== groupId)
  })),
  
  updateGroup: (groupId, updates) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    )
  })),
  
  // Operaciones para Items dentro de Groups
  addItemToGroup: (groupId, item) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === groupId
        ? { ...group, items: [...group.items, item] }
        : group
    )
  })),
  
  removeItemFromGroup: (groupId, itemId) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === groupId
        ? { ...group, items: group.items.filter(item => item.id !== itemId) }
        : group
    )
  })),
  
  updateItemInGroup: (groupId, itemId, updates) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : group
    )
  })),
  
  // Operaciones para ItemValues dentro de Items
  addValueToItem: (groupId, itemId, value) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map(item =>
              item.id === itemId
                ? { ...item, values: [...item.values, value] }
                : item
            )
          }
        : group
    )
  })),
  
  removeValueFromItem: (groupId, itemId, valueId) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map(item =>
              item.id === itemId
                ? { ...item, values: item.values.filter(value => value.id !== valueId) }
                : item
            )
          }
        : group
    )
  })),
  
  updateValueInItem: (groupId, itemId, valueId, updates) => set((state) => ({
    groups: state.groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    values: item.values.map(value =>
                      value.id === valueId ? { ...value, ...updates } : value
                    )
                  }
                : item
            )
          }
        : group
    )
  })),
  
  // Operaciones para Columns
  setColumns: (columns) => set({ columns }),
  
  addColumn: (column) => set((state) => ({
    columns: [...state.columns, column]
  })),
  
  removeColumn: (columnId) => set((state) => ({
    columns: state.columns.filter(column => column.id !== columnId)
  })),
  
  updateColumn: (columnId, updates) => set((state) => ({
    columns: state.columns.map(column =>
      column.id === columnId ? { ...column, ...updates } : column
    )
  })),
  
  // Helpers
  getGroupById: (groupId) => {
    const { groups } = get();
    return groups.find(group => group.id === groupId);
  },
  
  getItemById: (groupId, itemId) => {
    const group = get().getGroupById(groupId);
    return group?.items.find(item => item.id === itemId);
  },
  
  getValueById: (groupId, itemId, valueId) => {
    const item = get().getItemById(groupId, itemId);
    return item?.values.find(value => value.id === valueId);
  },
  
  getColumnById: (columnId) => {
    const { columns } = get();
    return columns.find(column => column.id === columnId);
  }
}));