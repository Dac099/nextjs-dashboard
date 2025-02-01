import { create } from 'zustand';
import type { ViewTypeName } from '@/utils/proyectTemplate/types';

type Filter = {
  type: string;
  value: string;
}

interface PageState {
  filters: Filter[];
  selectedRoute: string;
  viewSelected: string; 
  viewType: ViewTypeName;
  setFilters: (filters: Filter[]) => void;
  setSelectedRoute: (selectedRoute: string) => void;
  setViewSelected: (viewSelected: string) => void;
  setViewType: (viewType: ViewTypeName) => void;
}

export const useProjectStore = create<PageState>((set) => ({
  filters: [],
  selectedRoute: '',
  viewSelected: 'Tabla General',
  viewType: 'table',
  setFilters: (filters) => set({ filters }),
  setSelectedRoute: (selectedRoute) => set({ selectedRoute }),
  setViewSelected: (viewSelected) => set({ viewSelected }),
  setViewType: (viewType: ViewTypeName) => set({ viewType }),
}));