'use client';
import styles from './groupContainer.module.css';
import { OverlayPanel } from 'primereact/overlaypanel';
import type { GroupData, ColumnTypes } from '@/utils/types/views';
import { useState, useRef } from 'react';
import { GrClone as CloneIcon } from "react-icons/gr";
import { BiRename as RenameIcon } from "react-icons/bi";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";
import { useBoardDataStore } from '@/stores/boardDataStore';
import { deleteGroup, getBoardGroups, duplicateGroup, createNewColumn } from './actions';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { PiColumnsPlusRightFill as NewColumnIcon} from "react-icons/pi";
import { SelectButton } from 'primereact/selectbutton';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { useParams } from 'next/navigation';
import { useRoleUserActions } from '@/stores/roleUserActions';

type Props = {
  groupData: GroupData;
  setShowInputName: React.Dispatch<React.SetStateAction<boolean>>;
};

export function GroupController({ groupData, setShowInputName }: Props) {
  const params = useParams();
  const panelRef = useRef<OverlayPanel>(null);
  const { userRoleName, userActions } = useRoleUserActions();
  const { groups, setGroups, columns, setColumns } = useBoardDataStore();
  const [showDialog, setShowDialog] = useState(false);
  const [boardColumns, setBoardColumns] = useState<{id: string, name: string}[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<{id: string, name: string}[]>([]);
  const [operation, setOperation] = useState<'duplicate' | 'newColumn' | undefined>(undefined);
  const [newColumnName, setNewColumnName] = useState('');
  const columnTypes: {label: string, value: ColumnTypes}[] = [
    {label: 'Texto', value: 'text'},
    {label: 'Número', value: 'number'},
    {label: 'Fecha', value: 'date'},
    {label: 'Timeline', value: 'timeline'},
    {label: 'Porcentaje', value: 'percentage'},
    {label: 'Etiqueta', value: 'status'},
    {label: 'Usuario', value: 'user'}
  ];
  const [columnType, setColumnType] = useState<ColumnTypes>(columnTypes[0].value);

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
      setOperation('duplicate');
      const columns = await getBoardGroups(groupData.id);
      setBoardColumns(columns);
      setShowDialog(true);
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
      setShowDialog(false);
      setOperation(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewColumnProcess = () => {
    setOperation('newColumn');
    setShowDialog(true);
    panelRef.current?.hide();
  }

  const newColumnProcess = async() => {
    if(newColumnName.trim().length === 0) return;
    try {
      const newColumn = await createNewColumn(newColumnName, columnType, params.id as string);
      const newColumns = [...columns, newColumn];
      setColumns(newColumns);
      setNewColumnName('');
      setColumnType(columnTypes[0].value);
      setShowDialog(false);
      setOperation(undefined);
    } catch (error) {
      console.error(error);
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
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        className={styles.dialogContainer}
        resizable={false}
      >
        {operation && operation === 'duplicate' && 
          <>          
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
          </>
        }

        {operation && operation === 'newColumn' &&
          <>
            <h3 className={styles.dialogTitle}>Nueva columna</h3>
            <p className={styles.dialogDescription}>
              Para crear una columna debes de seleccionar el tipo y el nombre.
            </p>

            <section className={styles.dialogDataContainer}>
              <FloatLabel>
                <label 
                  htmlFor="columnName" 
                  style={{ 
                    color: 'var(--action-color)',
                    fontSize: '1.4rem',
                  }}
                >
                  Nombre de la columna
                </label>
                <InputText 
                  id="columnName" 
                  value={newColumnName}
                  onChange={e => setNewColumnName(e.target.value)}  
                  className={styles.newColumnInput}              
                />
              </FloatLabel>

              <article className={styles.columnTypeContainer}>
                <SelectButton 
                  options={columnTypes}
                  optionLabel='label'
                  optionValue='value'
                  value={columnType}
                  onChange={e => setColumnType(e.value)}
                  allowEmpty={false}
                />
              </article>
            </section>

            <section className={styles.dialogActions}>
              <Button 
                label='Crear columna'
                icon='pi pi-plus'
                onClick={newColumnProcess}
              />
            </section>
            
          </>
        }
      </Dialog>
      
      <OverlayPanel ref={panelRef}>
        
        <button 
          className={`${styles.btnControl}`}
          onClick={handleDuplicateProsess}
        >
          <CloneIcon size={15} />
          Clonar
        </button>

        <button
          className={`${styles.btnControl}`}
          onClick={() => {
            setShowInputName(true);
            panelRef.current?.hide();
          }}
        >
          <RenameIcon size={15} />
          Renombrar
        </button>

        <button
          className={`${styles.btnControl}`}
          onClick={handleDeleteGroup}
        >
          <DeleteIcon size={15} />
          Eliminar
        </button>

        {
          (userRoleName === 'SYSTEMS' || userRoleName === 'PROJECTMANAGER') && 
          userActions.includes('create') &&    
             
          <button
            className={styles.btnControl}    
            onClick={handleNewColumnProcess}      
          >
            <NewColumnIcon size={15} />
            Nueva columna
          </button>
        }

      </OverlayPanel >
    </>
  );
}
