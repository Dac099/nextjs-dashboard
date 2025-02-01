'use client';

import styles from './styles.module.css';
import { useProjectStore } from '@/stores/projectViewStore';
import { getViewsByPageId } from '@/services/projectsService';
import { ViewData } from '@/utils/proyectTemplate/types';
import { getIconByName } from '@/utils/helpers';

export const ViewsBar = () => {
  const views: ViewData[] = getViewsByPageId('1111');
  const setViewSelected = useProjectStore((state) => state.setViewType);
  const viewSelected = useProjectStore((state) => state.viewType);


  return (
    <nav>
      <ul className={styles['views-list']}>
        {views.map((view: ViewData) => (
          <li 
            key={view.viewId} 
            className={viewSelected === view.typeName ? styles.active : ''}
            onClick={() => setViewSelected(view.typeName)}
          >
            {getIconByName(view.icon)}
            {view.name}            
          </li>
        ))}
      </ul>
    </nav>
  );
}