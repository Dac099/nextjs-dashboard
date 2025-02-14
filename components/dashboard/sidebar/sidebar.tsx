import styles from './styles.module.css';
import { SideBarItem } from '@/components/common/sideBarItem/sideBarItem';
import { RiHome9Fill } from "react-icons/ri";
import { MdWorkspacesFilled } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";

export async function SideBar() {
  return (
    <aside className={styles.sidebar}>
      <section>
        <SideBarItem url='/'>
          <RiHome9Fill size={20}/>
          <p>Tu espacio</p>
        </SideBarItem>
      </section>

      <hr className={styles.division}/>

      <section className={styles.control}>
        
      </section>

      <section>

      </section>
    </aside>
  );
}