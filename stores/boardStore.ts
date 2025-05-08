import { create } from 'zustand';
import type { StatusByColumn, StatusValue } from "@/utils/types/groups";

type BoardStore = {
    boardStatus: StatusByColumn;
    setBoardStatus: (boardStatus: StatusByColumn) => void;
    addStatus: (status: StatusValue) => void;
    removeStatus: (valueId: string, columnId: string) => void;
    updateStatus: (status: StatusValue) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
    boardStatus: new Map() as StatusByColumn,
    setBoardStatus: (boardStatus: StatusByColumn) => set({ boardStatus: boardStatus }),
    addStatus: (status: StatusValue) => set(state => {
        if (state.boardStatus.has(status.columnId)) {
            const columnStatuses = [...state.boardStatus.get(status.columnId)!, status];
            
            // Crear un nuevo Map para asegurar que Zustand detecte el cambio
            const newBoardStatus = new Map(state.boardStatus);
            newBoardStatus.set(status.columnId, columnStatuses);
            
            return { boardStatus: newBoardStatus };
        }
        
        // Si la columna no existe, crear una nueva entrada
        const newBoardStatus = new Map(state.boardStatus);
        newBoardStatus.set(status.columnId, [status]);
        
        return { boardStatus: newBoardStatus };
    }),
    removeStatus: (valueId: string, columnId: string) => set(state => {
        if(!state.boardStatus.has(columnId)) return state;
        const columnStatus = state.boardStatus.get(columnId)!;
        
        const itemIndex = columnStatus.findIndex(statusItem => statusItem.id === valueId);
        if (itemIndex >= 0) {
            const updatedColumnStatus = [...columnStatus];
            updatedColumnStatus.splice(itemIndex, 1);
            
            // Crear un nuevo Map para asegurar que Zustand detecte el cambio
            const newBoardStatus = new Map(state.boardStatus);
            newBoardStatus.set(columnId, updatedColumnStatus);
            
            return { boardStatus: newBoardStatus };
        }
        
        return state;
    }),
    updateStatus: (status: StatusValue) => set(state => {
        if (state.boardStatus.has(status.columnId)) {
            const columnStatus = state.boardStatus.get(status.columnId)!;
            const itemIndex = columnStatus.findIndex(statusItem => statusItem.id === status.id);

            if (itemIndex >= 0) {
                const updatedColumnStatus = [...columnStatus];
                updatedColumnStatus.splice(itemIndex, 1, status);
                
                // Crear un nuevo Map para asegurar que Zustand detecte el cambio
                const newBoardStatus = new Map(state.boardStatus);
                newBoardStatus.set(status.columnId, updatedColumnStatus);
                
                return { boardStatus: newBoardStatus };
            }
        }

        return state;
    })
}));
