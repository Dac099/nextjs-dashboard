'use client';

import styles from './styles.module.css';
import { TiHome } from "react-icons/ti";
import { MdWorkspacesFilled } from "react-icons/md";
import Link from 'next/link';
import { ListItem } from './listItem/listItem';
import { usePathname } from 'next/navigation';

export function SideBar() {
  const pathname = usePathname();
  const proyectPages: {title: string, url: string}[] = [
    {
      title: 'Estatus General',
      url: '/projects/general',
    },
    {
      title: 'Planeación Global',
      url: '/projects/planning'
    },
    {
      title: 'Lista Proyectos',
      url: '/projects/list',
    }
  ];
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li className={pathname === '/' ? styles.selected : ''}>
            <Link href={'/'}>
              <TiHome /> Inicio
            </Link>
          </li>
        </ul>
        <hr />
        <section>
          <p className={styles.sidebar__workspace__title}> <span><MdWorkspacesFilled /></span> Espacios de trabajo</p>
          <ul>
            <ListItem pages={proyectPages} mainTitle={'Proyectos'}/>
            <ListItem pages={[]} mainTitle={'Regresar Web YNE'} mainUrl={'/'}/>
          </ul>
        </section>
      </nav>
    </aside>
  );
}