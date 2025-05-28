import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import type { MachineData, MachineDB, ProjectFormData } from '@/utils/types/projectDetail';
import { getMachines } from '@/actions/projectDetail';
import { InputText } from 'primereact/inputtext';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  closeDialog: () => void;
}

export function TableMachines({ projectFormData, setProjectFormData, closeDialog }: Props) {
  const [machines, setMachines] = useState<MachineDB[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  useEffect(() => {
    getMachines()
      .then((data) => setMachines(data))
      .catch(error => console.error('Error fetching machines:', error));
  }, []);

  const handleSelectMachine = (machine: MachineDB) => {
    if (machine) {
      const alreadyAdded = projectFormData.machines.some(m => m.serialNumber === machine.serialNumber);

      if (!alreadyAdded) {
        const { projectManagerId, mechanicalDesignerId, electricalDesignerId, assemblerId, developerId } = projectFormData;

        const machineToAdd: MachineData = {
          serialNumber: machine.serialNumber,
          mechanicalBudget: 0,
          machineBudget: 0,
          electricalBudget: 0,
          otherBudget: 0,
          mechanicalDesignTime: 0,
          electricalDesignTime: 0,
          assemblyTime: 0,
          developmentTime: 0,
          otherTime: 0,
          projectManager: projectManagerId,
          mechanicalDesigner: mechanicalDesignerId,
          electricalDesigner: electricalDesignerId,
          developer: developerId,
          assembler: assemblerId,
        };
        
        setProjectFormData({
          ...projectFormData,
          machines: [...projectFormData.machines, machineToAdd]
        });

        closeDialog();
      }
    }
  }

  const renderHeader = () => {
    return (
      <div>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
        />
      </div>
    );
  };

  const header = renderHeader();

  return (
    <DataTable 
      value={machines} 
      selectionMode="single" 
      onSelectionChange={e => handleSelectMachine(e.value)}
      size='large'
      showGridlines
      stripedRows
      paginator
      rows={30}
      removableSort
      globalFilterFields={['serialNumber', 'detail', 'title', 'owner', 'field', 'clientName']}
      filterDisplay="menu"
      filterLocale="es"
      header={header}
      globalFilter={globalFilter}
      >
      <Column field="serialNumber" header="NS" sortable/>
      <Column field="detail" header="Nombre" sortable/>
      <Column field="title" header="Descripción" sortable/>
      <Column field="owner" header="Propietario" sortable/>
      <Column field="fieldName" header="Sector" sortable/>
      <Column field="clientName" header="Client Name" sortable/>
    </DataTable>
  )
}