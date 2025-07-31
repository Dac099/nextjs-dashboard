'use client';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import styles from './fileForm.module.css';
import { Toast } from 'primereact/toast';
import { useRef, useState, useEffect } from 'react';
import { TableData } from './tableData/tableData';
import { CustomError } from '@/utils/customError';
import { Message } from 'primereact/message';
import { getSapReports } from '@/app/(dashboard)/sap-reports/actions';
import { useRoleUserActions } from '@/stores/roleUserActions';
import type { SapReportRecord } from '@/utils/types/sapReports';
import { TableDBData } from './tablaDBData/tableDBData';

export function FileForm() {
  const toast = useRef<Toast>(null);
  const { userRoleName } = useRoleUserActions();
  const [ errorMsg, setErrorMsg ] = useState<CustomError | null>(null);
  const [ sapReportData, setSapReportData ] = useState<SapReportRecord[]>([]);
  const [ fileData, setFileData ] = useState<string | null>(null);

  useEffect(() => {
    getSapReports()
      .then(data => setSapReportData(data))
      .catch(() => {
        setErrorMsg(new CustomError(
          500,
          'No se encontró ningún archivo',
          'Intente subir un archivo de seguimiento de compras'
        ));
      });
  }, []);

  const handleClearFormFile = () => {
    setErrorMsg(null);
    if (toast.current) {
      toast.current.clear();
    }
  };

  const handleSelectFile = (e: FileUploadSelectEvent) => {
    const fileToRead = e.files[0];
    const reader = new FileReader();

    reader.onloadend = (event) => {
      const fileContent = event.target?.result as string;

      if (fileContent) {
        setFileData(fileContent);
        setErrorMsg(null);
      } else {
        setErrorMsg(new CustomError(
          500,
          'Error al leer el archivo',
          'Intente de nuevo o verifique el archivo'
        ));
      }
    };

    reader.readAsText(fileToRead, 'utf16le');
  };
  return (
    <article className={styles.fileFormContainer}>
      <Toast ref={toast} />
      <section className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Seguimiento de compras</h1>
      </section>

      {errorMsg && 
        <section className={styles.errorSection}>
          <Message 
            severity='error'
            text={errorMsg.message}
          />
          <Message 
            severity='info'
            text={errorMsg.details}
          />
        </section>
      }

      { userRoleName === 'SYSTEMS' &&
        <FileUpload 
          mode='advanced'
          name='report[]'
          url='/sap-reports/api/'
          emptyTemplate={<EmptyFormTemplate />}
          uploadLabel='Subir el archivo'
          chooseLabel='Selecciona el archivo'
          cancelLabel='Cancelar subida'
          onSelect={handleSelectFile}
          multiple={false}
          accept='.txt'
          onRemove={handleClearFormFile}
        />
      }

      {fileData && <TableData data={fileData} />}
      {!fileData && sapReportData.length > 0 && <TableDBData data={sapReportData} />}
    </article>
  );
}

function EmptyFormTemplate() {
  return (
    <p className={styles.emptyFormTemplate}>Arrastra el archivo o seleccionalo</p>
  );
}