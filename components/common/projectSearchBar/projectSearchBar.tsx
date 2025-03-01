'use client';
import styles from './projectSearchBar.module.css';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import type { Project } from '@/utils/types/items';

type Props = {
  data: Project[];
  selectedProject: Project | null;
  setSelectedProject: Dispatch<SetStateAction<Project | null>>;
}

export function ProjectSearchBar({ data, selectedProject, setSelectedProject }: Props)
{
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    if(inputValue.length === 0)
    {
      setFilteredProjects([]);
      return;
    }
  
    const projects = data.filter(project => project.id.toLowerCase().startsWith(inputValue.toLowerCase()));
    setSelectedProject('');
    setFilteredProjects(projects);
  }, [inputValue, data, setSelectedProject]);

  function handleSelectProject(id: string)
  {
    setInputValue('');
    const selectedProject = data.filter(project => project.id == id);
    setSelectedProject(selectedProject[0]);
  }

  return(
    <article className={styles.container}>
      <input 
        type="text" 
        placeholder='Id del proyecto'
        onChange={e => setInputValue(e.target.value)}
        className={styles.inputSearcher}
        value={inputValue}
      />

      {filteredProjects.length > 0 &&
        <section className={styles.resultProjects}>
          {filteredProjects?.map(project => (
            <div 
              className={styles.projectItem}
              key={project.id}
              onClick={() => handleSelectProject(project.id)}
            >
              <span>{project.id}</span><p>{project.name}</p>
            </div>
          ))}
        </section>
      }

      {selectedProject &&
        <div 
          className={`${styles.projectItem} ${styles.projectItemSelected}`}
        >
          <span>{selectedProject.id}</span><p>{selectedProject.name}</p>
        </div>
      }
    </article>
  );
} 