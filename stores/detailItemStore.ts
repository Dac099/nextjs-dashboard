import { create } from 'zustand';
import {ItemData} from "@/utils/common/types";

interface ItemSelected {
    item: ItemData | null;
    showModal: boolean;
    setItem: (item: ItemData) => void;
    setShowModal: (showItem: boolean) => void;
}

export const useItemSelected = create<ItemSelected>((set) => ({
    item: null,
    showModal: false,
    setItem: (item: ItemData) => set({item}),
    setShowModal: (showModal: boolean) => set({showModal}),
}));