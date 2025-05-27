import styles from "./projectForm.module.css";
import { Accordion, AccordionTab } from "primereact/accordion";
import {
  ProjectFormData,
  FieldWithEmployees,
} from "@/utils/types/projectDetail";
import { InputNumber } from 'primereact/inputnumber';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  fieldsWithManagers: FieldWithEmployees;
};

export function ProjectMachinesDetail({
  projectFormData,
  setProjectFormData,
  fieldsWithManagers,
}: Props) {
  return (
    <Accordion multiple>
      {projectFormData.machines.map((machine, index) => (
        <AccordionTab key={machine.serialNumber} header={machine.serialNumber}>
          <section className={styles.machineDataCard}>
            <h3 className={styles.machineDataCardTitle}>Presupuestos</h3>
            <div className={styles.machineDataCardContent}>
              <article>
                <label
                  htmlFor="machine-budget"
                  className={styles.inputTextLabel}
                >
                  Maquinados
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">$</span>
                  <InputNumber
                    id="machine-budget"
                    value={machine.machineBudget}
                    onValueChange={(e) => {
                      const { machineBudget } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemMachineBudget =
                        projectFormData.machines[index].machineBudget;

                      const diff = newValue - itemMachineBudget;

                      setProjectFormData({
                        ...projectFormData,
                        machineBudget: machineBudget + diff,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index ? { ...m, machineBudget: newValue } : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
              <article>
                <label
                  htmlFor="mechanical-budget"
                  className={styles.inputTextLabel}
                >
                  Mecánica
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">$</span>
                  <InputNumber
                    id="mechanical-budget"
                    value={machine.mechanicalBudget}
                    onValueChange={(e) => {
                      const { mechanicalBudget } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemMechanicalBudget =
                        projectFormData.machines[index].mechanicalBudget;

                      const diff = newValue - itemMechanicalBudget;

                      setProjectFormData({
                        ...projectFormData,
                        mechanicalBudget: mechanicalBudget + diff,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index ? { ...m, mechanicalBudget: newValue } : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
              <article>
                <label
                  htmlFor="electrical-budget"
                  className={styles.inputTextLabel}
                >
                  Eléctrico
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">$</span>
                  <InputNumber
                    id="electrical-budget"
                    value={machine.electricalBudget}
                    onValueChange={(e) => {
                      const { electricalBudget } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemElectricalBudget =
                        projectFormData.machines[index].electricalBudget;

                      const diff = newValue - itemElectricalBudget;

                      setProjectFormData({
                        ...projectFormData,
                        electricalBudget: electricalBudget + diff,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index ? { ...m, electricalBudget: newValue } : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
              <article>
                <label htmlFor="other-budget" className={styles.inputTextLabel}>
                  Otros
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">$</span>
                  <InputNumber
                    id="other-budget"
                    value={machine.otherBudget}
                    onValueChange={(e) => {
                      const { otherBudget } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemOtherBudget =
                        projectFormData.machines[index].otherBudget;

                      const diff = newValue - itemOtherBudget;

                      setProjectFormData({
                        ...projectFormData,
                        otherBudget: otherBudget + diff,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index ? { ...m, otherBudget: newValue } : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
            </div>
          </section>

          <section className={styles.machineDataCard}>
            <h3 className={styles.machineDataCardTitle}>Tiempos</h3>
            <div className={styles.machineDataCardContent}>
              <article>
                <label
                  htmlFor="mechanical-design-time"
                  className={styles.inputTextLabel}
                >
                  Diseño mecánico
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock"></i>
                  </span>
                  <InputNumber
                    id="mechanical-design-time"
                    value={machine.mechanicalDesignTime}
                    onValueChange={(e) => {
                      const { mechanicalDesignTime } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemMechanicalDesignTime =
                        projectFormData.machines[index].mechanicalDesignTime;

                      setProjectFormData({
                        ...projectFormData,
                        mechanicalDesignTime:
                          mechanicalDesignTime +
                          newValue -
                          itemMechanicalDesignTime,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index
                            ? { ...m, mechanicalDesignTime: newValue }
                            : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
              <article>
                <label
                  htmlFor="electrical-design-time"
                  className={styles.inputTextLabel}
                >
                  Diseño eléctrico
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock"></i>
                  </span>
                  <InputNumber
                    id="electrical-design-time"
                    value={machine.electricalDesignTime}
                    onValueChange={(e) => {
                      const { electricalDesignTime } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemElectricalDesignTime =
                        projectFormData.machines[index].electricalDesignTime;

                      setProjectFormData({
                        ...projectFormData,
                        electricalDesignTime:
                          electricalDesignTime +
                          newValue -
                          itemElectricalDesignTime,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index
                            ? { ...m, electricalDesignTime: newValue }
                            : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
              <article>
                <label
                  htmlFor="assembly-time"
                  className={styles.inputTextLabel}
                >
                  Ensamble
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock"></i>
                  </span>
                  <InputNumber
                    id="assembly-time"
                    value={machine.assemblyTime}
                    onValueChange={(e) => {
                      const { assemblyTime } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemAssemblyTime =
                        projectFormData.machines[index].assemblyTime;

                      setProjectFormData({
                        ...projectFormData,
                        assemblyTime:
                          assemblyTime + newValue - itemAssemblyTime,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index ? { ...m, assemblyTime: newValue } : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
              <article>
                <label
                  htmlFor="development-time"
                  className={styles.inputTextLabel}
                >
                  Programación
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock"></i>
                  </span>
                  <InputNumber
                    id="development-time"
                    value={machine.developmentTime}
                    onValueChange={(e) => {
                      const { developmentTime } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemDevelopmentTime =
                        projectFormData.machines[index].developmentTime;

                      setProjectFormData({
                        ...projectFormData,
                        developmentTime:
                          developmentTime + newValue - itemDevelopmentTime,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index ? { ...m, developmentTime: newValue } : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
              <article>
                <label htmlFor="other-time" className={styles.inputTextLabel}>
                  Otro
                </label>
                <div className={`p-inputgroup ${styles.inputGroup}`}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock"></i>
                  </span>
                  <InputNumber
                    id="other-time"
                    value={machine.otherTime}
                    onValueChange={(e) => {
                      const { otherTime } = projectFormData;
                      const newValue = e.value ?? 0;
                      const itemOtherTime =
                        projectFormData.machines[index].otherTime;

                      setProjectFormData({
                        ...projectFormData,
                        otherTime: otherTime + newValue - itemOtherTime,
                        machines: projectFormData.machines.map((m, i) =>
                          i === index ? { ...m, otherTime: newValue } : m
                        ),
                      });
                    }}
                  />
                </div>
              </article>
            </div>
          </section>

          <section className={styles.machineDataCard}>
            <h3 className={styles.machineDataCardTitle}>Responsables</h3>
            <div className={styles.machineDataCardContent}>
              <article>
                <label
                  htmlFor="project-manager"
                  className={styles.inputTextLabel}
                >
                  Project Manager
                </label>
                <select
                  name="project-manager"
                  id="project-manager"
                  className={styles.dropdown}
                  value={projectFormData.projectManagerId}
                  onChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      projectManagerId: e.target.value,
                      machines: projectFormData.machines.map((m, i) =>
                        i === index
                          ? { ...m, projectManager: e.target.value }
                          : m
                      ),
                    })
                  }
                >
                  <option value="">Selecciona un responsable</option>
                  {fieldsWithManagers["Projects"].map((manager) => (
                    <option key={manager.userId} value={manager.userId}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </article>
              <article>
                <label
                  htmlFor="mechanical-designer"
                  className={styles.inputTextLabel}
                >
                  Diseñador mecánico
                </label>
                <select
                  name="mechanical-designer"
                  id="mechanical-designer"
                  className={styles.dropdown}
                  value={projectFormData.mechanicalDesignerId}
                  onChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      mechanicalDesignerId: e.target.value,
                      machines: projectFormData.machines.map((m, i) =>
                        i === index
                          ? { ...m, mechanicalDesigner: e.target.value }
                          : m
                      ),
                    })
                  }
                >
                  <option value="">Selecciona un responsable</option>
                  {fieldsWithManagers["Mechanical"].map((manager) => (
                    <option key={manager.userId} value={manager.userId}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </article>
              <article>
                <label
                  htmlFor="electrical-designer"
                  className={styles.inputTextLabel}
                >
                  Diseñador eléctrico
                </label>
                <select
                  name="electrical-designer"
                  id="electrical-designer"
                  className={styles.dropdown}
                  value={projectFormData.electricalDesignerId}
                  onChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      electricalDesignerId: e.target.value,
                      machines: projectFormData.machines.map((m, i) =>
                        i === index
                          ? { ...m, electricalDesigner: e.target.value }
                          : m
                      ),
                    })
                  }
                >
                  <option value="">Selecciona un responsable</option>
                  {fieldsWithManagers["Electrical"].map((manager) => (
                    <option key={manager.userId} value={manager.userId}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </article>
              <article>
                <label htmlFor="developer" className={styles.inputTextLabel}>
                  Programador
                </label>
                <select
                  name="developer"
                  id="developer"
                  className={styles.dropdown}
                  value={projectFormData.developerId}
                  onChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      developerId: e.target.value,
                      machines: projectFormData.machines.map((m, i) =>
                        i === index ? { ...m, developer: e.target.value } : m
                      ),
                    })
                  }
                >
                  <option value="">Selecciona un responsable</option>
                  {fieldsWithManagers["Electrical"].map((manager) => (
                    <option key={manager.userId} value={manager.userId}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </article>
              <article>
                <label htmlFor="assembler" className={styles.inputTextLabel}>
                  Ensamblador
                </label>
                <select
                  name="assembler"
                  id="assembler"
                  className={styles.dropdown}
                  value={projectFormData.assemblerId}
                  onChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      assemblerId: e.target.value,
                      machines: projectFormData.machines.map((m, i) =>
                        i === index ? { ...m, assembler: e.target.value } : m
                      ),
                    })
                  }
                >
                  <option value="">Seleccionar un responsable</option>
                  {fieldsWithManagers["Assembly"].map((manager) => (
                    <option key={manager.userId} value={manager.userId}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </article>
            </div>
          </section>
        </AccordionTab>
      ))}
    </Accordion>
  );
}
