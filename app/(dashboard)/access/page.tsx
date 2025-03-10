import styles from './page.module.css';
import { getAllUsers } from '@/actions/access';
import { UsersTable } from '@/components/common/usersTable/usersTable';

export default async function Page(){
  const users = await getAllUsers();
  return (
    <article className={styles.container}>
      <h1 className={styles.title}>Acceso a usuarios</h1>
      <UsersTable users={users}/>
    </article>
  );
}