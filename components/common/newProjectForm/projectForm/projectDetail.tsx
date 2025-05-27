import { Accordion, AccordionTab } from 'primereact/accordion';
import styles from "./projectForm.module.css";
import { ProjectFormData, FieldWithEmployees } from "@/utils/types/projectDetail";
import { InputNumber } from 'primereact/inputnumber';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  fieldsWithManagers: FieldWithEmployees;
};

export function ProjectDetail({ projectFormData, setProjectFormData, fieldsWithManagers }: Props) {
  return (
    <Accordion multiple>
      <AccordionTab header="Presupuestos">
        <section className={styles.machineDataCard}>
          <div className={styles.machineDataCardContent}>
            <article>
              <label htmlFor="machine-budget" className={styles.inputTextLabel}>
                Maquinados
              </label>
              <div className={`p-inputgroup ${styles.inputGroup}`}>
                <span className="p-inputgroup-addon">$</span>
                <InputNumber
                  id="machine-budget"
                  value={projectFormData.machineBudget}
                  onValueChange={(e) => {
                    const newValue = e.value ?? 0;
                    const updatedFormData = {
                      ...projectFormData,
                      machineBudget: newValue,
                    };
                    setProjectFormData({
                      ...updatedFormData,
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
                  value={projectFormData.mechanicalBudget}
                  onValueChange={(e) => {
                    const newValue = e.value ?? 0;
                    const updatedFormData = {
                      ...projectFormData,
                      mechanicalBudget: newValue,
                    };
                    setProjectFormData({
                      ...updatedFormData,
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
                  value={projectFormData.electricalBudget}
                  onValueChange={(e) => {
                    const newValue = e.value ?? 0;
                    const updatedFormData = {
                      ...projectFormData,
                      electricalBudget: newValue,
                    };
                    setProjectFormData({
                      ...updatedFormData,
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
                  value={projectFormData.otherBudget}
                  onValueChange={(e) => {
                    const newValue = e.value ?? 0;
                    const updatedFormData = {
                      ...projectFormData,
                      otherBudget: newValue,
                    };
                    setProjectFormData({
                      ...updatedFormData,
                    });
                  }}
                />
              </div>
            </article>
          </div>
        </section>
      </AccordionTab>
      <AccordionTab header="Tiempos">
        <section className={styles.machineDataCard}>
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
                  value={projectFormData.mechanicalDesignTime}
                  onValueChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      mechanicalDesignTime: e.value ?? 0,
                    })
                  }
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
                  value={projectFormData.electricalDesignTime}
                  onValueChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      electricalDesignTime: e.value ?? 0,
                    })
                  }
                />
              </div>
            </article>
            <article>
              <label htmlFor="assembly-time" className={styles.inputTextLabel}>
                Ensamble
              </label>
              <div className={`p-inputgroup ${styles.inputGroup}`}>
                <span className="p-inputgroup-addon">
                  <i className="pi pi-clock"></i>
                </span>
                <InputNumber
                  id="assembly-time"
                  value={projectFormData.assemblyTime}
                  onValueChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      assemblyTime: e.value ?? 0,
                    })
                  }
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
                  <i
                    className="pi pi
                        clock"
                  ></i>
                </span>
                <InputNumber
                  id="development-time"
                  value={projectFormData.developmentTime}
                  onValueChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      developmentTime: e.value ?? 0,
                    })
                  }
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
                  value={projectFormData.otherTime}
                  onValueChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      otherTime: e.value ?? 0,
                    })
                  }
                />
              </div>
            </article>
          </div>
        </section>
      </AccordionTab>
      <AccordionTab header="Responsables">
        <section className={styles.machineDataCard}>
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
                  })
                }
              >
                <option value="">Selecciona un responsable</option>
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
    </Accordion>
  );
}
