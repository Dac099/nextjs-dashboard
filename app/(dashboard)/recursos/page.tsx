import styles from './page.module.css';
import { getResources } from './actions';
import { ResourcesTable } from '@/components/resources/tableReports/tableReports';

export default async function Page() {
  const resources = await getResources();  

  return (
    <section className={styles.mainContainer}>
      <h1 className={styles.title}>Recursos</h1>

      <section>
        <ResourcesTable resources={resources} />
      </section>
    </section>
  );
}
