import { MainBar } from '@/components/dashboard/mainbar/mainbar';
import { SideBar } from '@/components/dashboard/sidebar/sidebar';
import styles from './styles.module.css';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className={styles.layout}>
      <MainBar />
      <section className={styles.container}>
        <SideBar />
        <main className={styles.content}>
          {children}
        </main>
      </section>
    </article>
  );
}