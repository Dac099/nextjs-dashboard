import styles from './styles.module.css';
import { SideBarItem } from '@/components/common/sideBarItem/sideBarItem';
import { RiHome9Fill } from "react-icons/ri";
import { SidebarControls } from '@/components/common/sidebarControls/sidebarControls';
import { getAllWorkspace } from '@/actions/dashboard';
import type { Workspace } from '@/utils/types/dashboard';
import { WorkspaceItem } from '@/components/common/workspaceItem/workspaceItem';

export async function SideBar() {
  const response: Workspace[] | Error = await getAllWorkspace();
  const workspaces: Workspace [] = [];

  if(!(response instanceof Error)){
    workspaces.push(...response);
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
        <WorkspaceItem workspace={workspace} key={workspace.id}/>
      ))}
    </aside>
  );
}