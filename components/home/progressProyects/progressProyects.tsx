'use client';
import styles from './progressProyects.module.css';
import { getRFQsData } from './actions';
import { useEffect, useState } from 'react';
import { RFQsData } from '@/utils/types/requisitionsTracking';
import { CommonLoader } from '@/components/common/commonLoader/commonLoader';
import { Tag } from 'primereact/tag';
import { RFQTypeMap } from '@/utils/helpers';
import { transformDateObjectToLocalString } from '@/utils/helpers';

//TODO: Hacer la agrupación de valores por RFQ

export function ProgressProyects() {
  const [rfqsItemsFetched, setRfqsItemsFetched] = useState<RFQsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const rfqsData = await getRFQsData(0, 300);
        setRfqsItemsFetched(rfqsData);        
      } catch (error) {
        console.error('Fetching RFQs data BAD RESULT: ', error);
      }finally {
        setLoading(false);
      }
    } 

    fetchData();
  }, []);

  if(loading){
    return <article className={styles.mainContainer}><CommonLoader /></article>;
  }

  const severitySAPStatus = (status: number) => {
    switch (status) {
      case -1 :
        return 'info';
      case 0:
        return 'danger'
      case 1:
        return 'warning';
      case 2:
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <article className={styles.mainContainer}>

      <section className={styles.filtersContainer}>
        <div className={styles.filterBuilder}>
          {/* Filtro que busca sobre el archivo de SAP */}
          Constructor de filtros
        </div>

        <div className={styles.filterMaster}>
          {/* Filtro que busca sobre la tabla de RFQs */}
          Filtro master
        </div>
      </section>

      <section className={styles.recordsContainer}>
        {rfqsItemsFetched && rfqsItemsFetched.items.length > 0 &&
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.recordsTable}>
                <thead>
                  <tr>
                    <th>No. Parte</th>
                    <th>RFQ</th>
                    <th>Proyecto</th>   
                    <th>Tipo RFQ</th>    
                    <th>Fecha Creación</th>
                    <th>Estado SAP</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqsItemsFetched.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.partNumber}</td>
                      <td>{item.rfqNumber}</td> 
                      <td>{item.projectId}</td>                     
                      <td>
                        <Tag 
                          value={RFQTypeMap[item.rfqType.trim()] || item.rfqType}
                          severity="info"
                          className={styles.rfqTypeTag}
                        />
                      </td>
                      <td>{transformDateObjectToLocalString(item.createdAt)}</td>
                      <td>
                        <Tag 
                          value={item.stateText}
                          className={styles.rfqTypeTag}
                          severity={severitySAPStatus(item.registerSap)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              {/* Aquí puedes agregar la lógica de paginación si es necesario */}
              <button>Atras</button>
              <button>Adelante</button>
            </div>
          </>
      }
      </section>
    </article>
  );
}