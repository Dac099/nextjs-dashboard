import styles from "./projectForm.module.css";
import { ProjectFormData, SectorItem } from "@/utils/types/projectDetail";
import { Chips } from "primereact/chips";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TableMachines } from "../tableMachines/tableMachines";
import { useState } from "react";
import { NewMachineForm } from '../newMachineForm/newMachineForm';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  sectors: SectorItem[];
};

export function MachinesInput({ projectFormData, setProjectFormData, sectors }: Props) {
  const [showMachinesList, setShowMachinesList] = useState(false);
  const [createNewMachine, setCreateNewMachine] = useState(false);

  const getMachineChips = (): string[] => {
    return projectFormData.machines.map((machine) => machine.serialNumber);
  };

  const handleDeleteMachine = (serialNumber: string) => {
    setProjectFormData({
      ...projectFormData,
      machines: projectFormData.machines.filter(
        (machine) => machine.serialNumber !== serialNumber
      ),
    });
  };

  const closeDialog = () => {
    setShowMachinesList(false);
    setCreateNewMachine(false);
  };

  return (
    <article className={styles.chipsContainer}>
      <section>
        <label htmlFor="" className={styles.inputTextLabel}>
          Máquinas
        </label>
        <Chips
          value={getMachineChips()}
          className={styles.chipsInput}
          onRemove={(e) => handleDeleteMachine(e.value)}
        />
      </section>
      <section className={styles.chipsActions}>
        <Button
          label="Agregar máquina"
          className={styles.actionBtn}
          onClick={() => {
            setCreateNewMachine(true);
            setProjectFormData({
              ...projectFormData,
              totalBudget: projectFormData.quoteItem?.totalBudget ?? 0,
            });
          }}
          disabled={projectFormData.projectFolio === ""}
        />
        <Button
          label="Listar máquinas"
          className={styles.actionBtn}
          onClick={() => {
            setShowMachinesList(true);
            if (projectFormData.machines.length === 0) {
              setProjectFormData({
                ...projectFormData,
                totalBudget: 0,
                machineBudget: 0,
                mechanicalBudget: 0,
                electricalBudget: 0,
                otherBudget: 0,
              });
            }
          }}
        />
      </section>

      <Dialog
        header={showMachinesList ? "Máquinas" : "Crear nueva máquina"}
        visible={showMachinesList || createNewMachine}
        onHide={() => closeDialog()}
        className={styles.dialogWindow}
        style={{ maxHeight: "800px" }}
        contentStyle={{ maxHeight: "800px", overflowY: "auto" }}
      >
        {showMachinesList && (
          <TableMachines
            projectFormData={projectFormData}
            setProjectFormData={setProjectFormData}
            closeDialog={closeDialog}
          />
        )}
        {createNewMachine && (
          <NewMachineForm
            projectFormData={projectFormData}
            setProjectFormData={setProjectFormData}
            closeDialog={closeDialog}
            sectors={sectors}
          />
        )}
      </Dialog>
    </article>
  );
}
