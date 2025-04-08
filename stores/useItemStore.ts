import { create } from 'zustand';
import { SubItem, TableValue } from '@/utils/types/groups';

// Define the type for the store
interface ItemStore {
  subItemsMap: Map<string, SubItem[]>;
  setSubItems: (itemId: string, subItems: SubItem[]) => void;
  addSubItem: (itemId: string, subItem: SubItem) => void;
  updateSubItem: (itemId: string, subItemId: string, updatedSubItem: Partial<SubItem>) => void;
  updateSubItemValue: (itemId: string, subItemId: string, columnId: string, newValue: string) => void;
  removeSubItem: (itemId: string, subItemId: string) => void;
  addSubItemValue: (itemId: string, subItemId: string, newValue: TableValue) => void;
}

// Create the zustand store
export const useItemStore = create<ItemStore>((set) => ({
  subItemsMap: new Map(),

  setSubItems: (itemId, subItems) => set((state) => {
    const newMap = new Map(state.subItemsMap);
    newMap.set(itemId, subItems);
    return { subItemsMap: newMap };
  }),

  addSubItem: (itemId, subItem) => set((state) => {
    const newMap = new Map(state.subItemsMap);
    const currentSubItems = newMap.get(itemId) || [];
    newMap.set(itemId, [...currentSubItems, subItem]);
    return { subItemsMap: newMap };
  }),

  updateSubItem: (itemId, subItemId, updatedSubItem) => set((state) => {
    const newMap = new Map(state.subItemsMap);
    const currentSubItems = newMap.get(itemId) || [];
    const updatedSubItems = currentSubItems.map((subItem) =>
      subItem.id === subItemId ? { ...subItem, ...updatedSubItem } : subItem
    );
    newMap.set(itemId, updatedSubItems);
    return { subItemsMap: newMap };
  }),

  updateSubItemValue: (itemId, subItemId, columnId, newValue) => set((state) => {
    const newMap = new Map(state.subItemsMap);
    const currentSubItems = newMap.get(itemId) || [];
    const updatedSubItems = currentSubItems.map((subItem) => {
      if (subItem.id === subItemId) {
        const updatedValues = subItem.values.map((value) =>
          value.columnId === columnId ? { ...value, value: newValue } : value
        );
        return { ...subItem, values: updatedValues };
      }
      return subItem;
    });
    newMap.set(itemId, updatedSubItems);
    return { subItemsMap: newMap };
  }),

  removeSubItem: (itemId, subItemId) => set((state) => {
    const newMap = new Map(state.subItemsMap);
    const currentSubItems = newMap.get(itemId) || [];
    const filteredSubItems = currentSubItems.filter((subItem) => subItem.id !== subItemId);
    newMap.set(itemId, filteredSubItems);
    return { subItemsMap: newMap };
  }),

  addSubItemValue: (itemId, subItemId, newValue) => set(state => {
    const newMap = new Map(state.subItemsMap);
    const parentSubItems = newMap.get(itemId) || [];
    const updatedSubItems = parentSubItems.map(subItem => {
      if (subItem.id === subItemId) {
        return { ...subItem, values: [...subItem.values, newValue] };
      }
      return subItem;
    });

    newMap.set(itemId, updatedSubItems);
    return { subItemsMap: newMap };
  }),
}));
