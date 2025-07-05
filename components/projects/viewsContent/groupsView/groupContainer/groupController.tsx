'use client';
import styles from './groupContainer.module.css';
import { OverlayPanel } from 'primereact/overlaypanel';
import type { GroupData } from '@/utils/types/views';
import { useState, useRef } from 'react';
import { GrClone as CloneIcon } from "react-icons/gr";
import { BiRename as RenameIcon } from "react-icons/bi";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";
import { useBoardDataStore } from '@/stores/boardDataStore';

type Props = {
  groupData: GroupData;
  setShowInputName: React.Dispatch<React.SetStateAction<boolean>>;
};

export function GroupController({ groupData, setShowInputName }: Props) {
  const panelRef = useRef<OverlayPanel>(null);

  return (
    <>
      <i
        className={`pi pi-ellipsis-v ${styles.iconControl}`}
        style={{ cursor: 'pointer' }}
        onClick={e => panelRef.current?.toggle(e)}
      ></i>
      <OverlayPanel ref={panelRef}>
        <button className={`${styles.btnControl}`}>
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
        <button className={`${styles.btnControl}`}>
          <DeleteIcon size={20} />
          Eliminar
        </button>
      </OverlayPanel >
    </>
  );
}
