'use client';
import styles from './styles.module.css';
import { MdWorkspacesFilled } from "react-icons/md";
import { KeyboardEvent, useState, useRef, useEffect } from 'react';
import { addNewWorkspace } from '@/actions/dashboard';
import { Role } from '@/utils/types/roles';
import { getRoleAccess } from '@/utils/userAccess';

export function SidebarControls() {
  const [userRole, setUserRole] = useState<Role>();
  const [ showInputDashboard, setShowInputDashboard ] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleAddWorkspace(e: KeyboardEvent)
  {
    const inputValue = inputRef.current?.value;
    if(e.code === 'Enter' && inputValue!.length > 0)
    {
      await addNewWorkspace(inputValue!);
      setShowInputDashboard(false);
    }

  }

  useEffect(() => {
    async function fetchData()
    {
      const role = await getRoleAccess();
      setUserRole(role);
    }

    fetchData();
  }, []);

  return (      
    <section className={styles.controls}>
      <span 
        className={styles.control}
        onClick={() => {
          if(userRole?.name === 'SYSTEMS'){
            setShowInputDashboard(!showInputDashboard)
          }
        }}
      >
        <MdWorkspacesFilled size={20}/>
        <p>Agregar workspace</p>
      </span>
      {showInputDashboard &&
        <input 
          type="text" 
          className={styles.input}
          onKeyUp={(e) => handleAddWorkspace(e as KeyboardEvent)}
          ref={inputRef}
        />
      }
    </section>
  );
}