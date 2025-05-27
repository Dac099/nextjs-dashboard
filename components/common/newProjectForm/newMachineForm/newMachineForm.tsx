import styles from "./newMachineFrom.module.css";
import {
  ProjectFormData,
  SectorItem,
  MachineData,
} from "@/utils/types/projectDetail";
import { insertNewMachine } from "@/actions/projectDetail";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import { Toast } from 'primereact/toast';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  sectors: SectorItem[];
  closeDialog: () => void;
};

type MachineDataState = {
  name: string;
  description: string;
  projectId: string;
  clientId: string;
  sectorId: string;
};

export function NewMachineForm({
  projectFormData,
  setProjectFormData,
  sectors,
  closeDialog,
}: Props) {
  const toastRef = useRef<Toast>(null);
  const [machineToCreate, setMachineToCreate] = useState<MachineDataState>({
    name: "",
    description: "",
    projectId: projectFormData.projectFolio,
    clientId: projectFormData.quoteItem?.clientId || "",
    sectorId: projectFormData.sector,
  });

  const handleAddNewMachine = async () => {
    const {name, description, projectId, clientId, sectorId} = machineToCreate;

    if(!name || !description || !projectId || !clientId || !sectorId) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor completa todos los campos.",
        life: 3000,
      });
      return;
    }

    const serialNumber = await insertNewMachine(name, description, projectId, clientId, sectorId);

    const newMachine: MachineData = {
      serialNumber: serialNumber,
      mechanicalBudget: 0,
      machineBudget: 0,
      electricalBudget: 0,
      otherBudget: 0,
      mechanicalDesignTime: 0,
      electricalDesignTime: 0,
      assemblyTime: 0,
      developmentTime: 0,
      otherTime: 0,
      projectManager: projectFormData.projectManagerId,
      mechanicalDesigner: projectFormData.mechanicalDesignerId,
      electricalDesigner: projectFormData.electricalDesignerId,
      developer: projectFormData.developerId,
      assembler: projectFormData.assemblerId,
    };

    setProjectFormData({
      ...projectFormData,
      machines: [...projectFormData.machines, newMachine],
    });
    closeDialog();
  };

  return (
    <article className={styles.newMachineForm}>
      <Toast ref={toastRef} />
      <h3 className={styles.title}>{projectFormData.projectFolio}</h3>

      <section className={styles.inputTextContainer}>
        <FloatLabel>
          <label htmlFor="name" className={styles.inputTextLabel}>
            Nombre
          </label>
          <InputText
            value={machineToCreate.name}
            onChange={(e) =>
              setMachineToCreate({ ...machineToCreate, name: e.target.value })
            }
            className={styles.inputText}
          />
        </FloatLabel>
      </section>

      <section className={styles.inputTextContainer}>
        <FloatLabel>
          <label htmlFor="description" className={styles.inputTextLabel}>
            Descripción
          </label>
          <InputText
            value={machineToCreate.description}
            onChange={(e) =>
              setMachineToCreate({
                ...machineToCreate,
                description: e.target.value,
              })
            }
            className={styles.inputText}
          />
        </FloatLabel>
      </section>

      <article className={styles.inputTextContainer}>
        <section>
          <label htmlFor="sector" className={styles.inputTextLabel}>
            Sector
          </label>
          <select
            id="sector"
            value={machineToCreate.sectorId}
            onChange={(e) =>
              setMachineToCreate({
                ...machineToCreate,
                sectorId: e.target.value,
              })
            }
            className={styles.dropdown}
          >
            <option value="">Seleccionar sector</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>
        </section>
      </article>

      <section className={styles.actions}>
        <button onClick={closeDialog}>Cancelar</button>
        <button onClick={handleAddNewMachine}>Agregar</button>
      </section>
    </article>
  );
}
