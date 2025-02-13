export type Option = {
  name: string,
  action: () => void
};

export type ViewTypeName = 'table' | 'chart' | 'gantt';

export type ViewData = {
  viewId: string,
  icon: string,
  name: string,
  typeName: ViewTypeName,
};

export type ViewType = {
  name: string;
  icon: string;
};