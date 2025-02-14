import { MainBar } from '@/components/dashboard/mainbar/mainbar';
import { SideBar } from '@/components/dashboard/sidebar/sidebar';
import styles from './styles.module.css';
import {ProjectDetail} from "@/components/common/projectDetail/projectDetail";

type Props = {
    children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
    return (
        <article className={styles.layout}>
            <MainBar />
            <section className={styles.container}>
                <SideBar />
                <main className={styles.content}>
                    {children}
                    <ProjectDetail />
                </main>
            </section>
        </article>
    );
}