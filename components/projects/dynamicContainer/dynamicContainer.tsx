'use client';

import { useProjectStore } from '@/stores/projectViewStore';
import styles from './styles.module.css';
import { Groups } from '@/components/views/groups/groups';

export const DynamicContainer = () => {
  const viewType = useProjectStore((state) => state.viewType);

  if(viewType === 'table') {
    return (
      <div className={styles.tableContainer}>
        <Groups />
      </div>
    );
  }

  if(viewType === 'chart') {
    return (
      <div className={styles.chartContainer}>
        <h1>Chart</h1>
      </div>
    );
  }

  if(viewType === 'gantt') {
    return (
      <div className={styles.mapContainer}>
        <h1>Map</h1>
      </div>
    );
  }
};