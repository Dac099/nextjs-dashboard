import { create } from 'zustand';
import type { StatusByColumn, StatusValue } from "@/utils/types/groups";

type BoardStore = {
    boardStatus: StatusByColumn;
    setBoardStatus: (boardStatus: StatusByColumn) => void;
    addStatus: (status: StatusValue) => void;
    removeStatus: (status: StatusValue) => void;
    updateStatus: (status: StatusValue) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
    boardStatus: new Map() as StatusByColumn,
    setBoardStatus: (boardStatus: StatusByColumn) => set({ boardStatus: boardStatus }),
    addStatus: (status: StatusValue) => set(state => {
        if (state.boardStatus.has(status.columnId)) {
            state.boardStatus.get(status.columnId)!.push(status);
        }
        return state;
    }),
    removeStatus: (status: StatusValue) => set(state => {
        if (state.boardStatus.has(status.columnId)) {
            const itemIndex = state.boardStatus.get(status.columnId)!
                .findIndex(statusItem => statusItem.id === status.id);

            if (itemIndex >= 0) {
                const modifiedStatusArray = state.boardStatus.get(status.columnId)!
                    .splice(itemIndex, 1);

                state.boardStatus.set(status.columnId, modifiedStatusArray);
            }
        }

        return state;
    }),
    updateStatus: (status: StatusValue) => set(state => {
        if (state.boardStatus.has(status.columnId)) {
            const itemIndex = state.boardStatus.get(status.columnId)!
                .findIndex(statusItem => statusItem.id === status.id);

            if (itemIndex >= 0) {
                const modifiedStatusArray = state.boardStatus.get(status.columnId);
                modifiedStatusArray!.splice(itemIndex, 1, status);

                state.boardStatus.set(status.columnId, modifiedStatusArray!);
            }
        }

        return state;
    })
}));
