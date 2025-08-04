import styles from './styles.module.css';
import { SideBarItem } from '@/components/common/sideBarItem/sideBarItem';
import { RiHome9Fill } from "react-icons/ri";
import { SidebarControls } from '@/components/common/sidebarControls/sidebarControls';
import { getAllWorkspace } from '@/actions/dashboard';
import type { Dashboard, WorkspaceWithDashboards } from '@/utils/types/dashboard';
import { WorkspaceItem } from '@/components/common/workspaceItem/workspaceItem';
import { SiOpenaccess } from "react-icons/si";
import { getRoleAccess } from '@/utils/userAccess';

export async function SideBar() {
  const response: WorkspaceWithDashboards | Error = await getAllWorkspace();
  let workspaces: Dashboard[][] = [];

  if (!(response instanceof Error)) {
    workspaces = Object.values(response);
  }

  const userRole = await getRoleAccess();

  return (
    <aside
      className={styles.sidebar}
    >
      <section>
        <SideBarItem url='/'>
          <RiHome9Fill size={20} />
          <p>Tu espacio</p>
        </SideBarItem>
      </section>

      <hr className={styles.division} />

      <SidebarControls userRole={userRole} />

      <hr className={styles.division} />

      {userRole.name === 'SYSTEMS' &&
        <SideBarItem url='/access'>
          <SiOpenaccess size={20} />
          <p>Accesos</p>
        </SideBarItem>
      }

      {userRole.name === 'SYSTEMS' &&
        <SideBarItem url='/sap-reports'>
          <i
            className='pi pi-money-bill'
            style={{ fontSize: '1.8rem' }}
          ></i>
          <p>Reporte SAP</p>
        </SideBarItem>
      }

      <SideBarItem url='/purchasings'>
        <i
          className='pi pi-shopping-cart'
          style={{ fontSize: '1.8rem' }}
        ></i>
        <p>Seguimiento Compras</p>
      </SideBarItem>

      {(userRole.name === 'SYSTEMS' || userRole.name === 'PROJECTMANAGER') &&
        <SideBarItem url='/recursos'>
          <i
            className='pi pi-users'
            style={{ fontSize: '1.8rem' }}
          ></i>
          <p>Recursos</p>
        </SideBarItem>
      }

      {workspaces.map(workspace => (
        <WorkspaceItem
          workspace={workspace}
          key={workspace[0].workspaceId}
          userRole={userRole}
        />
      ))}

      <section className={styles.sidebar__footer}>
        YNE Automatización 2025 Diseño y Desarrollo de Soluciones. All rights reserved.
      </section>
    </aside>
  );
}
