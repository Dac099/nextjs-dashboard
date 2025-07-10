"use client";
import styles from './resourcesContainer.module.css';
import { ProjectData } from "@/utils/types/items";
import { FaUserCircle as UserIcon } from "react-icons/fa";
import { getManagersData, getValuesLinkedToItem } from "./actions";
import { useEffect, useState, useMemo } from "react";
import { ManagersData } from '@/utils/types/projectDetail';
import { LuServerOff as ErrorIcon} from "react-icons/lu";
import { ItemValue } from '@/utils/types/views';

type Props = {
  projectData: ProjectData | null;
  itemId: string;
};

export function ResourcesContainer({ projectData, itemId }: Props) {
  const [managersData, setManagersData] = useState<ManagersData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [itemLinkedPersons, setItemLinkedPersons] = useState<string[]>([]);

  const managers = useMemo(() => ({
    electricalDesigner: projectData?.electrical_designer || null,
    mechanicalDesigner: projectData?.mechanical_designer || null,
    developer: projectData?.developer || null,
    assembler: projectData?.assembler || null,
    projectManager: projectData?.project_manager || null,
  }), [projectData]);

  const areasTranslation: Record<string, string> = {
    'Assembly' : 'Ensamble',
    'Electrical' : 'Eléctrico',
    'Mechanical' : 'Mecánico',
    'Projects': 'Project Manager'
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const responseManagers = await getManagersData(managers);
        const responseLinkedPersons = await getValuesLinkedToItem(itemId);        
        setManagersData(responseManagers);
        setItemLinkedPersons(responseLinkedPersons.map(responsable => {
          try {
            const parsedValue = JSON.parse(responsable.value);
            if(!parsedValue.id) throw new Error('Invalid format');
            return parsedValue.name;
          }catch{
            return responsable.value;
          }
        }))

        setErrorMsg(null);
      } catch (error) {
        setErrorMsg((error as Error).message);
      }
    }

    fetchData();
  }, [itemId, managers]);

  return (
    <article className={styles.mainContainer}>
      <h3 className={styles.sectionTitle}>Personas asignadas al proyecto</h3>
      
      {errorMsg &&
        <p className={styles.errorLabel}>
          <ErrorIcon size={30}/>
          {errorMsg}
        </p>
      }

      <section className={styles.resourcesContainer}>
        {
          managersData.length > 0 && managersData.map(manager => (
            <article key={manager.id} className={styles.cardManager}>
              
              <section className={styles.cardHeader}>
                <UserIcon size={40} className={styles.userIcon}/>
                <p className={styles.headerTitle}>{manager.name}</p>
                <p className={styles.managerArea}>{areasTranslation[manager.area]}</p>
              </section>

            </article>
          ))
        }
      </section>

      { itemLinkedPersons.length > 0 && 
        <>
          <h3 className={styles.sectionTitle}>Personas definidas en el item</h3>
          {itemLinkedPersons.map((person, index) => (
            <section key={index} className={styles.itemPerson}>
              <UserIcon size={20} />
              {person.replaceAll('"', '')}
            </section>
          ))}
        </>
      }
    </article>
  );
}
