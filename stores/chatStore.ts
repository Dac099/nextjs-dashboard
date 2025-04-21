import { create } from 'zustand';
import { ChatTask } from '@/utils/types/items';

export type ChatStore = {
  tasks: ChatTask[];
  setTasks: (tasks: ChatTask[]) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  tasks: [],
  setTasks: (tasks: ChatTask[]) => set({ tasks: tasks }),
}));
