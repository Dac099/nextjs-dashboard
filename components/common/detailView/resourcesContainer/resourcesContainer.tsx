"use client";
import styles from './resourcesContainer.module.css';
import { assignEmployeeToItem, deleteEmployeeFromItem, getFilteresEmployees, getItemEmployees } from './actions';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState, useEffect, useRef } from 'react';
import { FilteredEmployee, userAsignedToItem } from '@/utils/types/projectDetail';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDebounce } from '@/hooks/useDebounce';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { getSession } from '@/actions/auth';
import { transformDateObjectToLocalString } from '@/utils/helpers';
import { ContextMenu } from 'primereact/contextmenu';

type Props = {
  itemId: string;
};

export function ResourcesContainer({ itemId }: Props) {
  const [filteredEmployees, setFilteredEmployees] = useState<FilteredEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const debouncedQuery = useDebounce(filterValue, 200);
  const [onError, setOnError] = useState<{msg: string, detail: object} | null>(null);
  const [employeeSelected, setEmployeeSelected] = useState<FilteredEmployee | null>(null);
  const [itemEmployees, setItemEmployees] = useState<userAsignedToItem[]>([]);
  const [employeeToDelete, setEmployeeToDelete] = useState<userAsignedToItem | null>(null);
  const contextRef = useRef<ContextMenu>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const employees = await getItemEmployees(itemId);
        setItemEmployees(employees);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [itemId]);

  useEffect(() => {
    if(debouncedQuery){
      setLoading(true);
      getFilteresEmployees(debouncedQuery)
        .then((data) => {
          setFilteredEmployees(data);
        })
        .catch((error) => {
          console.error(error);
          setOnError({
            msg: 'Ocurrió un error al obtener los empleados',
            detail: error
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [debouncedQuery]);

  const handleSelectedEmployee = async(employee: FilteredEmployee) => {
    try {
      setEmployeeSelected(employee);
      
      const { id, username } = await getSession();
      await assignEmployeeToItem(itemId, employee.id, id);

      setItemEmployees(prev => [...prev, {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        asignedDate: new Date().toISOString(),
        asignedBy: username
      }]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteAsignation = async() => {
    try {
      await deleteEmployeeFromItem(itemId, employeeToDelete!.id);
      setItemEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete!.id));
      setEmployeeToDelete(null);
    } catch (error) {
      console.error(error);
      setOnError({
        msg: 'Ocurrió un error al eliminar la asignación',
        detail: error as object
      });
    }
  };

  return (
    <section className={styles.mainContainer}>
      <h3 className={styles.headerTitle}>Recursos asignados al Item</h3>

      <section className={styles.filterContainer}>

        <section className={styles.filterInput}>
          <div className='p-inputgroup'>
            
            <span className='p-inputgroup-addon'>
              <i className='pi pi-search'></i>              
            </span>

            <InputText 
            value={filterValue || ''}
              onChange={(e) => setFilterValue(e.target.value.toLowerCase())}
              placeholder='Busca por nombre, posición o departamento'  
              className={styles.inputText}            
            />            

            <Button 
              icon='pi pi-trash'
              severity='danger'
              onClick={() => {
                setFilterValue(null);
                setOnError(null);
              }}
            />
          </div>          
        </section>

        <section className={styles.filteredEmployeesContainer}>

          {onError &&
            <section className={styles.errorContainer}>
              <p>{onError.msg}</p>
            </section>
          }
          
          {loading && !onError &&
            <section className={styles.loadingElement}>
              <ProgressSpinner 
                style={{ width: '30px', height: '30px' }}
                strokeWidth='8'
                fill="var(--surface-ground)"
                animationDuration='.5s'
              />
            </section>
          }

          {!loading && filterValue && filterValue.length > 0 &&
            <>
              {
                filteredEmployees.length === 0
                ?
                <section className={styles.emptyResults}>
                  <p>Sin resultados</p>
                </section>
                :
                <section className={styles.filteredEmployeesList}>
                  <DataTable 
                    value={filteredEmployees}
                    stripedRows
                    size='large'
                    selectionMode='single'
                    selection={employeeSelected}
                    onSelectionChange={(e) => handleSelectedEmployee(e.value as FilteredEmployee)}
                    dataKey={'id'}
                    scrollable
                    scrollHeight='300px'
                  >
                    <Column field='name' header='Nombre'/>
                    <Column field='department' header='Departamento'/>
                    <Column field='position' header='Posición'/>
                    <Column header='Asignaciones' body={(employee) => (
                      <Tag 
                        severity='info' 
                        value={`${employee.assignedItems.length}`}
                        className={styles.tagAssigned}                        
                      />
                    )}/>
                  </DataTable>
                </section>  
              }
            </>
          }
        </section>
      </section>

      <section className={styles.itemEmployeesContainer}>
        {itemEmployees.length === 0
          ?
            <Tag 
              severity={'info'}
              value='No hay recursos asignados al item'
              className={styles.emptyEmployeesTag}
            />
          :
            <DataTable
              value={itemEmployees}
              stripedRows
              size='large'  
              onContextMenu={e => contextRef.current?.show(e.originalEvent)}          
              contextMenuSelection={employeeToDelete as userAsignedToItem}
              onContextMenuSelectionChange={(e) => setEmployeeToDelete(e.value as userAsignedToItem)}
            >
              <Column header='Nombre' field='name'/>
              <Column header='Departamento' field='department'/>
              <Column header='Posición' field='position'/>
              <Column header='Fecha de asignación' body={({asignedDate}: {asignedDate: object}) => (
                <p>{transformDateObjectToLocalString(asignedDate)}</p>
              )}/>
              <Column header='Asignado por' field='asignedBy'/>
            </DataTable>
        }
      </section>
      <ContextMenu 
        ref={contextRef}
        onHide={() => setEmployeeToDelete(null)}
        model={[
          {label: 'Eliminar', icon: 'pi pi-trash', command: () => handleDeleteAsignation()}
        ]}
      />
    </section>
  );
}
