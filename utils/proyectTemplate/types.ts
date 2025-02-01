export type Option = {
  name: string,
  action: () => void
};

export type ViewTypeName = 'table' | 'chart' | 'gantt';

export type ViewData = {
  viewId: string,
  pageId: string,
  icon: string,
  name: string,
  typeName: ViewTypeName,
};