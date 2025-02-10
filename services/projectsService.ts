import { Page } from '@/utils/dashboard/types';
import { ViewData } from '@/utils/proyectTemplate/types';
import { getPages } from '@/actions/pages';

export const getAllPages = async() => {
  const pages: Page[] | undefined = await getPages();

  if(pages){
    return pages.reduce((acc: { [key: string]: Page[] }, page) => {
      const { category } = page;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(page);
      return acc;
    }, {});
  }
}

export const getPageById = async(id: string): Promise<Page | undefined> => {
  const pages: Page[] | undefined =  await getPages();
  if(pages){
    return pages.find((page: Page) => page.id === id);
  }
}


export const getViewsByPageId = (id: string): ViewData[] => {
  return [
    {
      viewId: '0111',
      pageId: '1111',
      icon: 'main',
      name: 'Tabla General',
      typeName: 'table'
    },
    {
      viewId: '0222',
      pageId: '1111',
      icon: 'chart',
      name: 'Periodo anual',
      typeName: 'chart'
    },
    {
      viewId: '0333',
      pageId: '1111',
      icon: 'gantt',
      name: 'Registro de proyectos',
      typeName: 'gantt'
    }
  ];
}