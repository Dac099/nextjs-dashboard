import { fetchGroups } from '@/actions/groups';
import styles from './styles.module.css';
import { Groups } from '@/components/views/groups/groups';
import { fetchViews } from '@/services/projectsService';
import { ViewData } from '@/utils/proyectTemplate/types';
import type { GroupData } from '@/utils/common/types';

type Props = {
  pageId: string;
  viewId: string;
};

export async function  DynamicContainer ({ pageId, viewId }: Props) {
  const views: ViewData[] = await fetchViews(pageId);
  const selectedViewType = views.find((view: ViewData) => view.viewId === viewId)?.typeName as string;
  const groups: GroupData[] | Error = await fetchGroups(pageId);

  if(groups instanceof Error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error al cargar los grupos</p>
        <p>Ocurrió un error al cargar los grupos. Inténtalo más tarde o ponte en contacto con el equipo de sistemas</p>
      </div>
    );
  }

  if(selectedViewType === 'Tabla') {
    return (
      <div className={styles.tableContainer}>
        <Groups groups={groups}/>
      </div>
    );
  }

  if(selectedViewType === 'Gráfica') {
    return (
      <div className={styles.chartContainer}>
        <h1>Chart</h1>
      </div>
    );
  }

  if(selectedViewType === 'Gantt') {
    return (
      <div className={styles.mapContainer}>
        <h1>Map</h1>
      </div>
    );
  }
};