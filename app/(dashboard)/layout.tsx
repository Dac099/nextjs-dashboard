import { MainBar } from "@/components/dashboard/mainbar/mainbar";
import { SideBar } from "@/components/dashboard/sidebar/sidebar";
import styles from "./app-layout.module.css";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
      <article className={styles.layout}>
        <MainBar />
        <section className={styles.container}>
          <SideBar />
          <main className={styles.content}>{children}</main>
        </section>
      </article>
  );
}
