'use client';
import styles from './collapsibleItems.module.css';
import { ItemReport } from '@/utils/types/requisitionsTracking';
import { useState } from 'react';
import { Tag } from 'primereact/tag';
import { transformDateObjectToLocalString, getItemReportStatus } from '@/utils/helpers';

type Props = {
  title: string;
  items: ItemReport[];
  expandAll: boolean;
  globalFilterValue: string;
};

export function CollapsibleItems({ title, items, expandAll, globalFilterValue }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const highlightText = (text: string, filter: string) => {
    if (!filter) {
      return text;
    }
    const regex = new RegExp(`(${filter})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className={styles.highlight}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <header className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <i className={`pi ${isOpen ? 'pi-chevron-down' : 'pi-chevron-right'}`} />
        <h3 className={styles.title}>{`${title} (${items.length})`}</h3>
      </header>
      {(isOpen || expandAll) && (
        <div className={styles.content}>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Número de parte</th>
                <th>Descripción</th>
                <th>Proyecto</th>
                <th>Proveedor</th>
                <th>Maquinado</th>
                <th>Estado</th>
                <th>No. Orden</th>
                <th>Fecha O. Compra</th>
                <th>Fecha Promesa</th>
                <th>Cantidad Solicitada</th>
                <th>Folio Recepción</th>
                <th>Fecha Recepción</th>
                <th>Cantidad Recibida</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{highlightText(item.partNumber, globalFilterValue)}</td>
                  <td>{highlightText(item.description, globalFilterValue)}</td>
                  <td>{highlightText(item.projectId, globalFilterValue)}</td>
                  <td>{highlightText(item.supplier, globalFilterValue)}</td>
                  <td>{highlightText(item.machineType, globalFilterValue)}</td>
                  <td>
                    <Tag 
                      value={getItemReportStatus(item).text} 
                      severity={getItemReportStatus(item).severity}                      
                      className={styles.stateTag}
                    />
                  </td>
                  <td>{item.poNumber}</td>
                  <td>
                    {item.deliveryDate
                      ? transformDateObjectToLocalString(item.deliveryDate)
                      : <Tag
                          value='Sin Fecha de Entrega'
                          severity='warning'
                          className={styles.stateTag}
                        />
                    }
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
                      ? highlightText(item.warehouseTicket, globalFilterValue)
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
