import styles from './styles.module.css';
import { SideBarItem } from '@/components/common/sideBarItem/sideBarItem';
import { RiHome9Fill } from "react-icons/ri";
import { SidebarControls } from '@/components/common/sidebarControls/sidebarControls';
import { getAllWorkspace } from '@/actions/dashboard';
import type { Dashboard, WorkspaceWithDashboards } from '@/utils/types/dashboard';
import { WorkspaceItem } from '@/components/common/workspaceItem/workspaceItem';

export async function SideBar() {
  const response: WorkspaceWithDashboards | Error = await getAllWorkspace();
  let workspaces: Dashboard[][] = [];

  if(!(response instanceof Error)){
    workspaces = Object.values(response);
  }

  return (
    <aside className={styles.sidebar}>
      <section>
        <SideBarItem url='/'>
          <RiHome9Fill size={20}/>
          <p>Tu espacio</p>
        </SideBarItem>
      </section>

      <hr className={styles.division}/>

      <SidebarControls />

      <hr className={styles.division}/>

      {workspaces.map(workspace => (
        <WorkspaceItem workspace={workspace} key={workspace[0].workspaceId}/>
      ))}
    </aside>
  );
}