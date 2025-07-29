"use client";
import styles from './advanceFilter.module.css';
import { useState, useEffect } from "react";
import { OPERATIONS_BY_COLUMN, COLUMNS_TYPES } from "./contants";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { getRFQTypes } from '../actions';
import { RFQTypeMap } from '@/utils/helpers';
import { Message } from 'primereact/message';
import { filterBuilder } from '@/utils/helpers';
import { AdvancedFilter } from '@/utils/types/requisitionsTracking';

type Props = {
  setFilter: (filter: AdvancedFilter | null) => void;
};

export function AdvanceFilter({ setFilter }: Props) {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string | Date | Date[] | null>(null);
  const [rfqTypes, setRfqTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchRFQTypes = async () => {
      try{
        const types = await getRFQTypes();
        setRfqTypes(types);
      } catch (error) {
        console.error('Error fetching RFQ types:', error);
      }
    };

    fetchRFQTypes();
  }, []);

  return (
    <article>
      <section>
        <div>
          <select
            value={selectedColumn || ""}
            onChange={(e) => {
              setSelectedColumn(e.target.value);
              setUserInput(null);
            }}
            className={styles.selectElement}
          >
            <option value="">Columna para filtrar</option>
            <optgroup label="Requisición">
              <option value="rfq_type">Tipo de RFQ</option>
              <option value="general_state">Estado General</option>
              <option value="rfq_state">Estado RFQ</option>
              <option value="created_date">Fecha Creación</option>
            </optgroup>
            <optgroup label="Artículo">
              <option value="machine_type">Maquinado</option>
              <option value="article_state">Estado</option>
              <option value="po_date">Fecha O. Compra</option>
              <option value="promise_date">Fecha Promesa</option>
              <option value="reception_date">Fecha Entrega</option>
            </optgroup>
          </select>
        </div>

        <div>
          <select
            value={selectedOperator || ""}
            onChange={(e) => setSelectedOperator(e.target.value)}
            disabled={!selectedColumn}
            className={styles.selectElement}
          >
            {selectedColumn 
              ?
              OPERATIONS_BY_COLUMN[selectedColumn]!.map((operation) => (
                <option key={operation.value} value={operation.value}>
                  {operation.label}
                </option>
              ))
              :
              <option value="">Seleccione una columna</option>
            }
          </select>
        </div>

        <div>
          {(COLUMNS_TYPES[selectedColumn as keyof typeof COLUMNS_TYPES] === 'date')
            ? <Calendar 
                value={userInput as Date | Date[]}
                onChange={(e) => setUserInput(e.value as Date | Date[])}
                selectionMode={selectedOperator === 'between' ? 'range' : 'single'}
                placeholder="Seleccione una fecha"
                inputStyle={{ fontSize: '1.2rem', textAlign: 'center' }}
                style={{ width: '100%' }}
              />
            : selectedColumn === 'rfq_type'
            ? <select
                className={styles.selectElement}
              >
                {rfqTypes.map((type) => (
                  <option key={type} value={type}>
                    {RFQTypeMap[type.trim()] || type}
                  </option>
                ))}
              </select>
            : selectedColumn === 'general_state'
            ? <select
                className={styles.selectElement}
              >
                <option value="received">RFQ recibida</option>
                <option value="partial_received">Parcialmente recibida</option>
                <option value="po_generated">PO generada</option>
                <option value="no_sap_record">Sin registro SAP</option>
                <option value="sap_record">Registrada en SAP</option>
                <option value="partial_sap_record">Parcialmente registrada</option>
              </select>
            : selectedColumn === 'rfq_state'
            ? <select className={styles.selectElement}>
                <option value="authorized">Autorizado</option>
                <option value="canceled">Cancelado</option>
                <option value="processed">RFQ procesada</option>
                <option value="unauthorized">Por autorizar</option>
              </select>
            : selectedColumn === 'machine_type'
            ? <select className={styles.selectElement}>
                <option value="internal">Interno</option>
                <option value="external">Externo</option>
              </select>
            : selectedColumn === 'article_state'
            ? <select className={styles.selectElement}>
                <option value="po_canceled">PO cancelada</option>
                <option value="po_generated">PO generada</option>
                <option value="on_warehouse">En almacén</option>
                <option value="found_in_sap">Registrada en SAP</option>
                <option value="partial_found_sap">En SAP sin RFQ</option>
                <option value="not_found_in_sap">Sin registro SAP</option>
              </select>
            : <Message 
                text="Selecciona una columna válida"
                severity='warn'
                className={styles.errorMessage}
              />
          }
        </div>

        <div className={styles.actionsContainer}>
          <Button 
            label="Limpiar"
            icon="pi pi-times"
            severity="danger"
            onClick={() => {
              setSelectedColumn(null);
              setSelectedOperator(null);
              setFilter(null);
            }}
            outlined
          />
          <Button 
            label="Aplicar"
            icon="pi pi-check"
            severity="success"
            disabled={!selectedColumn && !selectedOperator && !userInput}
            onClick={() => {
              if(!selectedColumn || !selectedOperator || !userInput) return;  
              setFilter(filterBuilder(selectedColumn, selectedOperator, userInput));
            }}
          />
        </div>
      </section>
    </article>
  );
}
