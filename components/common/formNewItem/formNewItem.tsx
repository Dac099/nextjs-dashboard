import styles from './formNewItem.module.css';
import { useParams } from 'next/navigation';
import { formatDate } from '@/utils/helpers';
import { useEffect, useMemo, useState } from 'react';
import { getAllProjects, getBoardColumns } from '@/actions/items';
import type { Column, Project } from '@/utils/types/items';
import { GroupHeaderColumn } from '../groupHeaderColumn/groupHeaderColumn';
import { getBoardStatusList } from '@/actions/groups';
import { ProjectSearchBar } from '../projectSearchBar/projectSearchBar';
import { getProjectData } from '@/actions/items';

type Props = {
  groupId: string;
};

type Tag = {
  id: string;
  color: string;
  text: string;
};

export function FormNewItem({groupId}: Props)
{
  const {id: boardId, viewId} = useParams();
  const [columns, setColumns] = useState<Column[]>([]);
  const [onError, setOnError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [menuData, setMenuData] = useState<Tag[]>([]);
  const [optionSelected, setOptionSelected] = useState('selectProject');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const tagsByColumn = useMemo(() => new Map<string, Tag[]>(), []);

  useEffect(() => {
    async function fetchData()
    {
      try {
        // const colRes = await getBoardColumns(boardId as string);
        // setColumns(colRes);
        // const tagsColumns = colRes.filter(col => col.type === 'status');
        // const statusPromises = tagsColumns.map(col => getBoardStatusList(col.id));
        // const statusValues = await Promise.all(statusPromises);

        // tagsColumns.forEach((column, index) => {
        //   tagsByColumn.set(column.id, statusValues[index]);
        // });
        const projects: Project[] = await getAllProjects();
        setAllProjects(projects);
        
      } catch (error) {
        console.log(error);
        setOnError(true);
      } finally
      {
        setLoading(false);
      }
    }

    fetchData();
  }, [boardId, groupId, tagsByColumn]);


  return (
    <section>
      <section className={styles.header}>
        <p>Nuevo proyecto</p>
        <p>{formatDate(new Date)}</p>
      </section>


      <section className={styles.options}>
        <p
          className={optionSelected === 'selectProject' ? styles.selected : ''}
          onClick={() => setOptionSelected('selectProject')}
        >
          Proyecto existente
        </p>
        <p
          className={optionSelected === 'newProject' ? styles.selected : ''}
          onClick={() => setOptionSelected('newProject')}
        >
          Nuevo proyecto
        </p>
      </section>

      <section className={styles.content}>
        {optionSelected === 'selectProject' && 
          <article className={styles.searcher}>
            <p>Empieza seleccionado un proyecto</p>
            <article>
              <ProjectSearchBar 
                selectedProject={selectedProject} 
                setSelectedProject={setSelectedProject}
                data={allProjects}
              />
            </article>
          </article>
        }
      </section>
    </section>
  );
}