import styles from './styles.module.css';
import { getPageById } from '@/services/projectsService';
import type { Page } from '@/utils/dashboard/types';
import { ViewsBar } from '@/components/projects/viewsBar/viewsBar';
import { FiltersBar } from '@/components/projects/filtersBar/filtersBar';
import { DynamicContainer } from '@/components/projects/dynamicContainer/dynamicContainer';
import { MultiBtn } from '@/components/common/multiBtn/multiBtn';
import { countGroups } from '@/actions/groups';

export default async function Page(props: {params: Promise<{page_id: string, view_id: string}>}) {
    const { page_id, view_id } = await props.params;
    const page: Page | undefined = await getPageById(page_id);

    return (
        <article className={styles['base-container']}>

            <section>
                <p className={styles.title}>{ page?.name || 'Tablero YNE' }</p>
            </section>

            <section className={styles['views-container']}>
                <ViewsBar pageId={page_id} viewId={view_id}/>
            </section>

            <section className={styles['filters-container']}>
                <MultiBtn/>
                <FiltersBar />
            </section>

            <section className={styles['dynamic-container']}>
                <DynamicContainer pageId={page_id} viewId={view_id}/>
            </section>

        </article>
    );
} 