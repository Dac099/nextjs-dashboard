export type GroupData = {
  id: string;
  title: string;
  color: string;
};

export type ItemData = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatData = {
  id: string;
  message: string;
  createdAt: string;
};

export type TaskData = {
  id: string;
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

export type PageProperties = {
  PText: string;
  PNumber: string;
  PTimeLine: string;
  PStatus: string;
};

export type ItemDetail = {
  itemId: string;
  textProps: Array<PropertyData>;
  numberProps: Array<PropertyData>;
  statusProps: Array<PropertyData>;
  timelineProps: Array<PropertyData>;
  chats:Array<ChatData>;
};

export type DefinedProperty = 'Text' | 'Number' | 'Date' | 'User' | 'TimeLine' | 'Status';
export type Format = 'Currency' | 'Count' | 'Porcentual';
export type DetailView = 'chats' | 'files' | 'activity' | 'projectDetail';