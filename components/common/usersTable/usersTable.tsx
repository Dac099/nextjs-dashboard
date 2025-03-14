'use client';
import { FormEvent } from 'react';
import styles from './usersTable.module.css';
import { setUserPermission } from '@/actions/access';

type Props = {
  users: {
    id: number;
    name: string;
    username: string;
    role: string;
  }[];
};

export function UsersTable({users}: Props){

  async function setUserRole(userId: number, e: FormEvent<HTMLSelectElement>){
    const selectElement = e.currentTarget as HTMLSelectElement;
    const newRole = selectElement.value;
    
    await setUserPermission(newRole, userId);
  }

  return (
    <table className={styles.tableUsers}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Nombre de usuario</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.username}</td>
            <td>
              <select 
                className={styles.roleSelection}
                value={user.role}
                onChange={e => setUserRole(user.id, e)}
              >
                <option value="">Define el rol</option>

                <option value="SYSTEMS">Sistemas</option>

                <option value="PROJECTMANAGER">Project Manager</option>

                <option value="PURCHASES">Compras</option>

                <option value="GUEST">Visitante</option>

                <option value="READER">Lector</option>

                <option value="LEADPM">Lead</option>

              </select>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
  );
}