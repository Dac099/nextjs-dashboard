import styles from "./formNewItem.module.css";
import { formatDate } from "@/utils/helpers";
import { useState } from "react";
import { NewProjectForm } from "../newProjectForm/newProjectForm";
import { SelectProyectForm } from '../selectProyectForm/selectProyectForm';
import type { QuoteItem } from '@/utils/types/projectDetail';

type Props = {
  groupId: string;
  closeContainer: () => void;
};

export function FormNewItem({ groupId, closeContainer }: Props) {
  const [optionSelected, setOptionSelected] = useState("selectProject");

  return (
    <section>
      <section className={styles.header}>
        <section className={styles.titleContainer}>
          <span className={styles.closeButton} onClick={closeContainer}>x</span>
          <p>Nuevo proyecto</p>
        </section>
        <p>{formatDate(new Date())}</p>
      </section>

      <section className={styles.options}>
        <p
          className={optionSelected === "selectProject" ? styles.selected : ""}
          onClick={() => setOptionSelected("selectProject")}
        >
          Proyecto existente
        </p>
        <p
          className={optionSelected === "newProject" ? styles.selected : ""}
          onClick={() => setOptionSelected("newProject")}
        >
          Crear proyecto
        </p>
      </section>

      <section className={styles.content}>
        {optionSelected === "selectProject" && (
          <SelectProyectForm
            groupId={groupId}
            closeContainer={closeContainer}
          />
        )}

        {optionSelected === "newProject" && 
          <NewProjectForm 
            groupId={groupId}
            closeContainer={closeContainer}
          />
        }
      </section>
    </section>
  );
}
