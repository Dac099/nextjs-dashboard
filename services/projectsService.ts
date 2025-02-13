import { Page, Result, Acc } from '@/utils/dashboard/types';
import { ViewData, ViewType } from '@/utils/proyectTemplate/types';
import { 
  getPages, 
  getViewsByPageId, 
  getViewTypes,
} from '@/actions/pages';


export const getAllPages = async() => {
  const pages: Page[] | undefined = await getPages();
  if(!pages){
    return [];
  }

  const groupedPages = Object.groupBy(pages, (page: Page) => page.category);
  const result: Result = {};

  Object.keys(groupedPages).forEach((category: string) => {
    
    const pageWithViews: Acc = groupedPages[category]!.reduce((acc: Acc, page: Page) => {
      if(!acc[page.name]){
        acc[page.name] = {
          id: page.id,
          name: page.name,
          category: page.category,
          views: []
        };
      }
      acc[page.name].views.push(page.viewId);
      return acc;
    }, {});
    
    if(!result[category]){
      result[category] = [];
    }
    
    result[category] = Object.values(pageWithViews);
  });
  
  return result;
}

export const getPageById = async(id: string): Promise<Page | undefined> => {
  const pages: Page[] | undefined =  await getPages();
  if(pages){
    return pages.find((page: Page) => page.id === id);
  }
}

export const fetchViews = async(id: string): Promise<ViewData[]> => {
  const result: ViewData[] | Error = await getViewsByPageId(id);
  
  if(result instanceof Error) throw result;
  return result;
}

export const fetchViewTypes = async(): Promise<ViewType[]> => {
  const result: ViewType[] | Error = await getViewTypes();

  if(result instanceof Error) throw result;
  return result;
}
