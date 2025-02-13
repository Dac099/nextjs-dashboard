import styles from './styles.module.css';
import { fetchViews, fetchViewTypes } from '@/services/projectsService';
import { ViewData, ViewType } from '@/utils/proyectTemplate/types';
import { getIconByName } from '@/utils/helpers';
import { ModalViewBar } from './modal/modal';
import Link from 'next/link';

type Props = {
  pageId: string;
  viewId: string;
}

export async function ViewsBar({ pageId, viewId }: Props) {
  const views: ViewData[] = await fetchViews(pageId);
  const viewTypes: ViewType[] = await fetchViewTypes();

  return (
    <nav>
      <ul className={styles['views-list']}>
        {views.map((view: ViewData) => (
          <li 
            key={view.viewId} 
            className={viewId === view.viewId ? styles.active : ''}
          >
            <Link 
              href={`/projects/${pageId}/${view.viewId}`}
            >
              {getIconByName(view.icon)}
              {view.name}            
            </Link>
          </li>
        ))}
        <li>
          <ModalViewBar viewTypes={viewTypes} />
        </li>
      </ul>
    </nav>
  );
}