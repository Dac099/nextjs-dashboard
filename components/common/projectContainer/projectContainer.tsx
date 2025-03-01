import styles from './projectContainer.module.css';
import type { ProjectData, Project } from '@/utils/types/items';
import { LuUnplug } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { getAllProjects } from '@/actions/items';
import { Skeleton } from '../skeleton/skeleton';
import { ProjectSearchBar } from '../projectSearchBar/projectSearchBar';

type Props = {
  data: ProjectData;
};

export function ProjectContainer({ data }: Props)
{
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setIsError] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getAllProjects()
    .then((res) => setProjects(res))
    .finally(() => setIsLoading(false))
    .catch(() => setIsError(true));
  }, []);

  if(!data){
    return (
      <article className={styles.containerForm}>
        <section className={styles.formAdvice}>
          <p> <span><LuUnplug size={35}/></span>No hay proyecto relacionado</p>
          <p>
            Este item aún no se relaciona con ningún proyecto. <br />
            Decide entre escoger un proyecto existente o creando uno
          </p>
        </section>

        <section className={styles.projectSelect}>
          <div className={styles.selectContainer}>
              {isLoading
                ? 
                <Skeleton width='500px' height='40px' rounded='10px'/>
                : 
                <ProjectSearchBar 
                  data={projects}
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              }
          </div>

        </section>
      </article>
    );
  }
  
  return (
    <article>

    </article>
  );
}