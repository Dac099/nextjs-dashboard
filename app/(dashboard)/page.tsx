import React from 'react';
import styles from './page.module.css';
import { TabView, TabPanel } from 'primereact/tabview';

export default async function Page() {
  const tabStyles: React.CSSProperties = {
    fontSize: '1.3rem',
  };

  return (
    <article className={styles.mainContainer}>
      <TabView>
        <TabPanel header="Progreso de proyectos" style={tabStyles}>
        </TabPanel>
      </TabView>
    </article>
  );
}

/**
 * Datos requeridos
 * - Lista de proyectos (tb_proyectos)
 *  - Requisiciones asignadas al proyecto (tb_requisiciones)
 *  - Ordenes de compra asignadas al proyecto (Archivo del servidor)
 *    - La relación entre las requisiciones y las órdenes de compra se hace por medio del RFQ o del proyecto
 *  - Agrupar items del archivo por proyecto
 */