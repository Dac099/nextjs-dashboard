import styles from './page.module.css';
import { getAllUsers } from '@/actions/access';
import { UsersTable } from '@/components/common/usersTable/usersTable';
import { getRoleAccess } from '@/utils/userAccess';
import { redirect } from 'next/navigation';

export default async function Page(){
  const users = await getAllUsers();
  const userRole = await getRoleAccess();

  if(userRole.name !== 'SYSTEMS'){
    redirect('/');
  }

  return (
    <article className={styles.container}>
      <h1 className={styles.title}>Acceso a usuarios</h1>
      <UsersTable users={users}/>
    </article>
  );
}