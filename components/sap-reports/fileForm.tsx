'use client';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import styles from './fileForm.module.css';
import { Toast } from 'primereact/toast';
import { useRef, useState, useEffect } from 'react';
import { TableData } from './tableData/tableData';
import { CustomError } from '@/utils/customError';
import { Message } from 'primereact/message';
import { getFileData } from '@/app/(dashboard)/sap-reports/actions';
import { useRoleUserActions } from '@/stores/roleUserActions';

export function FileForm() {
  const toast = useRef<Toast>(null);
  const { userRoleName } = useRoleUserActions();
  const [ errorMsg, setErrorMsg ] = useState<CustomError | null>(null);
  const [ fileData, setFileData ] = useState<string | null>(null);
  const [ fileDate, setFileDate ] = useState<string | null>(null);

  useEffect(() => {
    getFileData()
      .then(([data, date]) => {
        setFileData(data);
        setFileDate(date);
        setErrorMsg(null);
      })
      .catch(() => {
        setErrorMsg(new CustomError(
          500,
          'No se encontró ningún archivo',
          'Intente subir un archivo de seguimiento de compras'
        ));
      });
  }, []);

  const handleClearFormFile = () => {
    setFileData(null);
    setFileDate(null);
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
        setFileDate(new Date(fileToRead.lastModified).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }));
        setErrorMsg(null);
      } else {
        setErrorMsg(new CustomError(
          500,
          'Error al leer el archivo',
          'Intente de nuevo o verifique el archivo'
        ));
      }
    };

    reader.readAsText(fileToRead, 'utf-8');
  };
  return (
    <article className={styles.fileFormContainer}>
      <Toast ref={toast} />
      <section className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Seguimiento de compras</h1>
        {!errorMsg && fileDate &&
          <p>Fecha del archivo: <span className={styles.dateFileString}>{fileDate}</span></p>
        }
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
    </article>
  );
}

function EmptyFormTemplate() {
  return (
    <p className={styles.emptyFormTemplate}>Arrastra el archivo o seleccionalo</p>
  );
}