'use client';
import styles from './styles.module.css';
import type { Dashboard } from '@/utils/types/dashboard';
import { KeyboardEvent, useState, useEffect, useRef } from 'react';
import { MdWorkspaces } from "react-icons/md";
import { TiCancel } from "react-icons/ti";
import { updateWorkspace, addDashboard } from '@/actions/dashboard';
import { GoPlus } from "react-icons/go";
import { Tooltip } from '../tooltip/tooltip';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Role } from '@/utils/types/roles';

type Props = {
  workspace: Dashboard[];
  userRole: Role;
};

export function WorkspaceItem({ workspace, userRole }: Props){
  const router = useRouter();
  const params = useParams();
  const boardId: string = params.id as string || '';
  const inputRef = useRef<HTMLInputElement>(null);
  const inputDashboardRef = useRef<HTMLInputElement>(null);
  const [ changeName, setChangeName ] = useState<boolean>(false);
  const [ workspaceName, setWorkspaceName ] = useState<string>(workspace[0].workspaceName);
  const [ inputDashboard, setInputDashboard ] = useState<boolean>(false);
  const [ dashboards, setDashboards ] = useState<Dashboard[]>(workspace);


  async function closeInputTitle(e: KeyboardEvent)
  {
    if(e.code === 'Enter' && workspace[0].workspaceName !== workspaceName)
    {
      setChangeName(false);
      await updateWorkspace(workspace[0].workspaceId, false, workspaceName);
    }
  }

  async function handleAddDashBoard(e: KeyboardEvent){
    const inputValue: string = inputDashboardRef.current?.value as string;

    if(e.code === 'Enter')
    {
      setInputDashboard(false);
    }

    if(e.code === 'Escape') setInputDashboard(false);

    if(e.code === 'Enter' && inputValue.length > 0)
    {
      setInputDashboard(false);    
      const boardId = await addDashboard(inputValue, workspace[0].workspaceId);
      setDashboards([
        ...dashboards,
        {
          boardId: boardId,
          workspaceId: workspace[0].workspaceId,
          workspaceName: workspace[0].workspaceName,
          boardName: inputValue,
        }
      ]);
      router.push(`/board/${boardId}`);
    }
  }


  useEffect(() => {
    if(changeName) inputRef.current?.select();
    if(inputDashboard) inputDashboardRef.current?.focus();
  }, [changeName, inputDashboard]);

  return (
    <article>
      <section className={styles.workspaceTitle}>
        <section>
          {!changeName && 
            <div className={styles.textTitle}>
              <MdWorkspaces />
              <p 
                onDoubleClick={() => setChangeName(true)}
              >
                {workspaceName}
              </p>
            </div>
          }
          {changeName &&
            <div className={styles.inputTitle}>
              <input 
                type="text"
                defaultValue={workspaceName}
                onKeyUp={(e) => closeInputTitle(e as KeyboardEvent)}
                onChange={e => setWorkspaceName(e.target.value)}
                ref={inputRef}
              />
              <TiCancel 
                size={20} 
                className={styles.inputTitleClose}
                onClick={() => setChangeName(false)}
              />
            </div>
          }
        </section>
        <section>
          {!changeName && 
            <Tooltip text='Agregar tablero'>
              <div className={styles.addIcon}>
                <GoPlus size={20} onClick={() => {
                  if(userRole!.name === 'SYSTEMS' || userRole!.name === 'LEADPM'){
                    setInputDashboard(!inputDashboard)
                  }
                }}/>
              </div>
            </Tooltip>
          }
        </section>        
      </section>

      <section className={styles.dashboards}>
        {inputDashboard && 
          <input 
            type="text"
            ref={inputDashboardRef}
            placeholder='Título del tablero'
            onKeyUp={(e) => handleAddDashBoard(e as KeyboardEvent)}
            className={styles.inputDashboard}
          />
        }
        {dashboards.map(dashboard => {
          if(dashboard.boardId)
          {
            return (
              <Link
                key={dashboard.boardId}
                href={`/board/${dashboard.boardId}`}
                className={`${styles.boardLink} ${dashboard.boardId === boardId ? styles.boardLinkActive : ''}`}
              >
                {dashboard.boardName}
              </Link>
            );
          }
        })}
      </section>
    </article>
  );
}