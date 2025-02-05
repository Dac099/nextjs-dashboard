export type GroupData = {
  id: string;
  title: string;
  color: string;
  items: Array<ItemData>;
};

export type ItemData = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  totalTasks: number;
  completedTasks: number;
  chats: Array<ChatData>;
  properties: Array<PropertyData>;
};

export type ChatData = {
  id: string;
  message: string;
  tasks: Array<TaskData>;
  createdAt: string;
  updatedAt: string;
};

export type TaskData = {
  id: string;
  chatId: string;
  isCompleted: boolean;
  content: string;
};

export type PropertyData = {
  id: string;
  itemId: string;
  userTitle: string;
  propertyTitle: string;
  type: DefinedProperty;
  value?: string | number;
  format?: Format; 
  startDate?: string;
  endDate?: string;
  color?: string;
  userName?: string;
};

export type DefinedProperty = 'Text' | 'Number' | 'Date' | 'User' | 'TimeLine' | 'Status';
export type Format = 'Currency' | 'Count' | 'Porcentual';