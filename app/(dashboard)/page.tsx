import React from 'react';
import styles from './page.module.css';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressProyects } from '@/components/home/progressProyects/progressProyects';

export default async function Page() {
  const tabStyles: React.CSSProperties = {
    fontSize: '1.3rem',
  };

  return (
    <article className={styles.mainContainer}>
      <TabView>
        <TabPanel header="Compras de proyectos" style={tabStyles}>
          <section className={styles.tabContent}>
            <ProgressProyects />
          </section>
        </TabPanel>
      </TabView>
    </article>
  );
}

