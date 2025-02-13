export type Page = {
  name: string;
  id: string;
  category: string;
  viewId: string;
}

export type PageWithViews = {
  id: string;
  name: string;
  category: string;
  views: string[];
};

export type Acc = {
  [key: string]: PageWithViews
};

export type Result = {
  [key: string]: PageWithViews[]
};