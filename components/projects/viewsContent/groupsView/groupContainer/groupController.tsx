'use client';
import styles from './groupContainer.module.css';
import { OverlayPanel } from 'primereact/overlaypanel';
import type { GroupData } from '@/utils/types/views';
import { useState, useRef } from 'react';
import { GrClone as CloneIcon } from "react-icons/gr";
import { BiRename as RenameIcon } from "react-icons/bi";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";
import { useBoardDataStore } from '@/stores/boardDataStore';
import { deleteGroup, getBoardGroups, duplicateGroup } from './actions';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

type Props = {
  groupData: GroupData;
  setShowInputName: React.Dispatch<React.SetStateAction<boolean>>;
};

export function GroupController({ groupData, setShowInputName }: Props) {
  const panelRef = useRef<OverlayPanel>(null);
  const { groups, setGroups } = useBoardDataStore();
  const [showColumnsDialog, setShowColumnsDialog] = useState(false);
  const [boardColumns, setBoardColumns] = useState<{id: string, name: string}[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<{id: string, name: string}[]>([]);

  const handleDeleteGroup = async() => {
    try {
      await deleteGroup(groupData.id);
      const newGroups = groups.filter(group => group.id !== groupData.id);
      setGroups(newGroups);
      panelRef.current?.hide();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDuplicateProsess = async() => {
    try {
      const columns = await getBoardGroups(groupData.id);
      setBoardColumns(columns);
      setShowColumnsDialog(true);
      panelRef.current?.hide();
    } catch (error) {
     console.log(error);
    }
  };

  const duplicateOperation = async() => {
    try {
      const newGroup = await duplicateGroup(groupData.id, selectedColumns);
      const newGroups = [...groups, newGroup];
      setGroups(newGroups);
      setShowColumnsDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <i
        className={`pi pi-ellipsis-v ${styles.iconControl}`}
        style={{ cursor: 'pointer' }}
        onClick={e => panelRef.current?.toggle(e)}
      />
      
      <Dialog 
        visible={showColumnsDialog}
        onHide={() => setShowColumnsDialog(false)}
        className={styles.dialogContainer}
        resizable={false}
      >
        <h3 
          className={styles.dialogTitle}
          style={{ color: 'var(--action-color)' }}
        >
          Duplicación de grupo
        </h3>
        <p
          className={styles.dialogDescription}
        >
          Marca las columnas que deseas que conserven su valor para los items de este grupo.
        </p>
        <p
          className={styles.dialogHighlightText}
          style={{ color: 'var(--action-color)' }}
        >
          Si no seleccionas ninguna columna, los items se duplicarán sin valores.
        </p>

        <MultiSelect 
          options={boardColumns}
          value={selectedColumns}
          onChange={e => setSelectedColumns(e.value)}
          placeholder='Selecciona las columnas'
          className={styles.dialogSelect}
          optionLabel='name'
        />

        <section className={styles.dialogActions}>
          <Button 
            label="Duplicar"
            icon="pi pi-clone"
            onClick={duplicateOperation}
          />
        </section>
      </Dialog>
      
      <OverlayPanel ref={panelRef}>
        
        <button 
          className={`${styles.btnControl}`}
          onClick={handleDuplicateProsess}
        >
          <CloneIcon size={20} />
          Clonar
        </button>

        <button
          className={`${styles.btnControl}`}
          onClick={() => {
            setShowInputName(true);
            panelRef.current?.hide();
          }}
        >
          <RenameIcon size={20} />
          Renombrar
        </button>

        <button
          className={`${styles.btnControl}`}
          onClick={handleDeleteGroup}
        >
          <DeleteIcon size={20} />
          Eliminar
        </button>

      </OverlayPanel >
    </>
  );
}
