import { Page } from '@/utils/dashboard/types';
import { ViewData } from '@/utils/proyectTemplate/types';

export const getAllPages = () => {
  const pages: Page[] =  [
    {
      id: '1111',
      name: 'General',
      category: 'projects'
    },
    {
      id: '2222',
      name: 'Lista de proyectos',
      category: 'projects'
    },
    {
      id: '3333',
      name: 'Planeación global',
      category: 'projects'
    }
  ];

  return pages.reduce((acc: { [key: string]: Page[] }, page) => {
    const { category } = page;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(page);
    return acc;
  }, {});
}

export const getPageById = (id: string): Page | undefined => {
  const pages: Page[] =  [
    {
      id: '1111',
      name: 'General',
      category: 'projects'
    },
    {
      id: '2222',
      name: 'Lista de proyectos',
      category: 'projects'
    },
    {
      id: '3333',
      name: 'Planeación global',
      category: 'projects'
    }
  ];
  return pages.find((page: Page) => page.id === id);
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