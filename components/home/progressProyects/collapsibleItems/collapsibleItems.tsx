'use client';
import styles from './collapsibleItems.module.css';
import { ItemReport } from '@/utils/types/requisitionsTracking';
import { useState } from 'react';
import { Tag } from 'primereact/tag';
import { transformDateObjectToLocalString, getItemReportStatus } from '@/utils/helpers';

type Props = {
  title: string;
  items: ItemReport[];
};

export function CollapsibleItems({ title, items }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <header className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <i className={`pi ${isOpen ? 'pi-chevron-down' : 'pi-chevron-right'}`} />
        <h3 className={styles.title}>{`${title} (${items.length})`}</h3>
      </header>
      {isOpen && (
        <div className={styles.content}>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Número de parte</th>
                <th>Descripción</th>
                <th>Proyecto</th>
                <th>Tipo RFQ</th>
                <th>Maquinado</th>
                <th>Estado</th>
                <th>Fecha Compra</th>
                <th>Cantidad Solicitada</th>
                <th>Folio Recepción</th>
                <th>Fecha Recepción</th>
                <th>Cantidad Recibida</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.partNumber}>
                  <td>{item.partNumber}</td>
                  <td>{item.description}</td>
                  <td>{item.projectId}</td>
                  <td>{item.rfqType}</td>
                  <td>{item.machineType}</td>
                  <td>
                    <Tag 
                      value={getItemReportStatus(item).text} 
                      severity={getItemReportStatus(item).severity}                      
                      className={styles.stateTag}
                    />
                  </td>
                  <td>
                    {item.poDate 
                      ? transformDateObjectToLocalString(item.poDate)
                      : <Tag 
                          value='Sin PO' 
                          severity='warning' 
                          className={styles.stateTag}
                        />
                    }
                  </td>
                  <td>
                    {item.poQuantity !== null 
                      ? item.poQuantity
                      : <Tag 
                          value='Sin PO' 
                          severity='warning' 
                          className={styles.stateTag}
                        />
                    }
                  </td>
                  <td>
                    {item.warehouseTicket
                      ? item.warehouseTicket
                      : <Tag 
                          value='Sin Recepción' 
                          severity='warning' 
                          className={styles.stateTag}
                        />
                    }
                  </td>
                  <td>
                    {item.warehouseTicketDate
                      ? transformDateObjectToLocalString(item.warehouseTicketDate)
                      : <Tag 
                          value='Sin Recepción' 
                          severity='warning' 
                          className={styles.stateTag}
                        />
                    }
                  </td>
                  <td>
                    {item.warehouseTicketQuantity !== null && item.warehouseTicketQuantity > 0
                      ? item.warehouseTicketQuantity
                      : <Tag 
                          value='Sin Recepción' 
                          severity='warning' 
                          className={styles.stateTag}
                        />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
