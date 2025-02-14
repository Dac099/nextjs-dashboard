'use client';
import styles from './styles.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  url: string;
  children: React.ReactNode;
};

export const SideBarItem = (props: Props) => {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <Link
      href={props.url}
      className={`${styles.linkItem} ${pathName === props.url ? styles.active : ''}`}
    >
      {props.children}
    </Link>
  );
}