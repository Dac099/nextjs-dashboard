import { create } from 'zustand';

type Filter = {
  type: string;
  value: string;
}

interface PageState {
  filters: Filter[];
  selectedRoute: string;
  viewSelected: string; 
  viewType: string;
  setFilters: (filters: Filter[]) => void;
  setSelectedRoute: (selectedRoute: string) => void;
  setViewSelected: (viewSelected: string) => void;
  setViewType: (viewType: string) => void;
}

export const useProjectStore = create<PageState>((set) => ({
  filters: [],
  selectedRoute: '',
  viewSelected: 'Tabla General',
  viewType: 'table',
  setFilters: (filters) => set({ filters }),
  setSelectedRoute: (selectedRoute) => set({ selectedRoute }),
  setViewSelected: (viewSelected) => set({ viewSelected }),
  setViewType: (viewType: string) => set({ viewType }),
}));