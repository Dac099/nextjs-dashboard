'use client';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import styles from './fileForm.module.css';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { TableData } from './tableData/tableData';
import { CustomError } from '@/utils/customError';
import { Message } from 'primereact/message';
import { useRoleUserActions } from '@/stores/roleUserActions';
import { TableDBData } from './tablaDBData/tableDBData';

export function FileForm() {
  const toast = useRef<Toast>(null);
  const { userRoleName } = useRoleUserActions();
  const [ errorMsg, setErrorMsg ] = useState<CustomError | null>(null);
  const [ fileData, setFileData ] = useState<string | null>(null);

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
      
      {/* Header siempre visible */}
      <section className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Seguimiento de compras</h1>
      </section>

      {/* Sección de carga de archivo - condicional */}
      {userRoleName === 'SYSTEMS' && (
        <section className={styles.uploadSection}>
          {errorMsg && 
            <div className={styles.errorSection}>
              <Message 
                severity='error'
                text={errorMsg.message}
              />
              <Message 
                severity='info'
                text={errorMsg.details}
              />
            </div>
          }

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
        </section>
      )}

      {/* Sección de tabla - siempre visible */}
      <section className={styles.tableSection}>
        {fileData ? <TableData data={fileData} /> : <TableDBData />}
      </section>
    </article>
  );
}

function EmptyFormTemplate() {
  return (
    <p className={styles.emptyFormTemplate}>Arrastra el archivo o seleccionalo</p>
  );
}