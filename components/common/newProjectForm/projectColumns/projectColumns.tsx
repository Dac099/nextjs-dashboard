"use client";
import { Button } from "primereact/button";
import styles from "./projectColumns.module.css";
import { ProjectFormData } from "@/utils/types/projectDetail";
import { useState, useEffect, useRef } from "react";
import { getColumnsBoard } from "@/actions/groups";
import { useParams } from "next/navigation";
import { Column } from "@/utils/types/groups";
import { TagColumn } from "../../columnsValues/tagColumn/tagColumn";
import { PrimitiveColumn } from "../../columnsValues/primitiveColumn/primitiveColumn";
import { DateColumn } from "../../columnsValues/dateColumn/dateColumn";
import { PercentageColumn } from "../../columnsValues/percentageColumn/percentageColumn";
import TimeLineColumn from "../../columnsValues/timelineColumn/timelineColumn";
import {
  insertNewProject,
  insertMachinesProject,
} from "@/actions/projectDetail";
import { addItemByProject, insertTableValues } from "@/actions/items";
import { Toast } from 'primereact/toast';

interface ProjectColumnsProps {
  projectData: ProjectFormData;
  closeContainer: () => void;
  setFormStep: (step: "projectInfo") => void;
  groupId: string;
}

type ColumnValue = {
  columnId: string;
  value: string;
};

export function ProjectColumns({
  projectData,
  closeContainer,
  setFormStep,
  groupId,
}: ProjectColumnsProps) {
  const toastRef = useRef<Toast>(null);
  const { id: boardId, viewId } = useParams() as { id: string; viewId: string };
  const [columns, setColumns] = useState<Column[]>([]);
  const [columnsData, setColumnsData] = useState<ColumnValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const boardColumns = await getColumnsBoard(boardId);
        setColumns(boardColumns);
      } catch {
        setColumns([]);
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [boardId]);

  const handleCreateProject = async () => {
    try {
      await insertNewProject(projectData);
      await insertMachinesProject(projectData);
      const itemId = await addItemByProject(
        groupId,
        viewId,
        boardId,
        projectData.projectFolio,
        projectData.projectFolio
      );
  
      await insertTableValues(itemId, columnsData);
    }catch {
      if (toastRef.current) {
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear proyecto. Inténtalo de nuevo.',
          life: 3000,
        });
      }
      return;
    }
    closeContainer();
  };

  const addColumnValue = (columnId: string, value: string) => {
    const valueIndex = columnsData.findIndex(
      (item) => item.columnId === columnId
    );
    if (valueIndex !== -1) {
      // Update existing value
      const updatedColumnsData = [...columnsData];
      updatedColumnsData[valueIndex].value = value;
      setColumnsData(updatedColumnsData);
    } else {
      // Add new value
      setColumnsData([...columnsData, { columnId, value }]);
    }
  };

  if(isLoading) {
    return <div className={styles.loading}>Cargando columnas...</div>;
  }

  return (
    <article className={styles.formStep}>
      <Toast ref={toastRef} position="top-right" />
      <div className={styles.columnsContainer}>
        {columns.map((column) => (
          <section key={column.id} className={styles.columnContainer}>
            <div className={styles.columnHeader}>
              <p>{column.name}</p>
            </div>
            <div className={styles.columnContent}>
              {column.type === "status" && (
                <TagColumn
                  columnId={column.id}
                  callback={(value) => addColumnValue(column.id, value)}
                />
              )}

              {column.type === "date" && (
                <DateColumn
                  callback={(value) => addColumnValue(column.id, value)}
                />
              )}

              {column.type === "number" && (
                <PrimitiveColumn
                  callback={(value) => addColumnValue(column.id, value)}
                  type={column.type}
                />
              )}

              {column.type === "text" && (
                <PrimitiveColumn
                  callback={(value) => addColumnValue(column.id, value)}
                  type={column.type}
                />
              )}

              {column.type === "percentage" && (
                <PercentageColumn
                  callback={(value) => addColumnValue(column.id, value)}
                />
              )}

              {column.type === "timeline" && (
                <TimeLineColumn
                  callback={(value) => addColumnValue(column.id, value)}
                />
              )}
            </div>
          </section>
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <Button
          label="Atrás"
          icon="pi pi-arrow-left"
          onClick={() => setFormStep("projectInfo")}
        />
        <Button
          label="Crear proyecto"
          icon="pi pi-check"
          onClick={handleCreateProject}
        />
      </div>
    </article>
  );
}
