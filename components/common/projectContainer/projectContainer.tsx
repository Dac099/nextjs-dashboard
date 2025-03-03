import { useState } from "react";
import styles from "./projectContainer.module.css";
import type { ProjectData } from "@/utils/types/items";

type Props = {
  data: ProjectData;
};

export function ProjectContainer({ data }: Props) {
  const [formData, setFormData] = useState<ProjectData>(data);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Manejo especial para campos numéricos y fechas
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else if (type === "date") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : new Date(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <article className={styles.container}>
      <section className={styles.contentData}>
        <form id="projectForm">
          <table className={styles.projectTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Campo</th>
                <th className={styles.tableHeader}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {/* Sección de Información General */}
              <tr className={styles.sectionHeader}>
                <td colSpan={2}>Información General</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>ID del Proyecto</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="id"
                    id="id"
                    value={formData.id || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Nombre del Proyecto</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="name"
                    id="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Descripción</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="description"
                    id="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Cliente</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="client"
                    id="client"
                    value={formData.client || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Creado por</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="created_by"
                    id="created_by"
                    value={formData.created_by || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Tipo</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="type"
                    id="type"
                    value={formData.type || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Estado</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="state"
                    id="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>División</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="division"
                    id="division"
                    value={formData.division || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Nota</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="note"
                    id="note"
                    value={formData.note || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              {/* Sección de Fechas */}
              <tr className={styles.sectionHeader}>
                <td colSpan={2}>Fechas</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Fecha de Inicio</td>
                <td className={styles.fieldValue}>
                  <input
                    type="date"
                    className={`${styles.formInput} ${styles.dateInput}`}
                    name="beginning_date"
                    id="beginning_date"
                    value={
                      formData.beginning_date
                        ? new Date(formData.beginning_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Fecha de Finalización</td>
                <td className={styles.fieldValue}>
                  <input
                    type="date"
                    className={`${styles.formInput} ${styles.dateInput}`}
                    name="end_date"
                    id="end_date"
                    value={
                      formData.end_date
                        ? new Date(formData.end_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Fecha de Creación</td>
                <td className={styles.fieldValue}>
                  <input
                    type="date"
                    className={`${styles.formInput} ${styles.dateInput}`}
                    name="created_at"
                    id="created_at"
                    value={
                      formData.created_at
                        ? new Date(formData.created_at)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Fecha de Kickoff</td>
                <td className={styles.fieldValue}>
                  <input
                    type="date"
                    className={`${styles.formInput} ${styles.dateInput}`}
                    name="kickoff"
                    id="kickoff"
                    value={
                      formData.kickoff
                        ? new Date(formData.kickoff).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </td>
              </tr>

              {/* Sección de Presupuestos */}
              <tr className={styles.sectionHeader}>
                <td colSpan={2}>Presupuestos</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Presupuesto Inicial</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="initial_budget"
                    id="initial_budget"
                    value={formData.initial_budget || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Moneda</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="currency"
                    id="currency"
                    value={formData.currency || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Presupuesto Mecánico</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="mechanical_budget"
                    id="mechanical_budget"
                    value={formData.mechanical_budget || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Presupuesto de Máquina</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="machine_budget"
                    id="machine_budget"
                    value={formData.machine_budget || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Presupuesto Eléctrico</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="electrical_budget"
                    id="electrical_budget"
                    value={formData.electrical_budget || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Otros Presupuestos</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="other_budget"
                    id="other_budget"
                    value={formData.other_budget || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              {/* Sección de Números de Referencia */}
              <tr className={styles.sectionHeader}>
                <td colSpan={2}>Números de Referencia</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Número de Serie</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="num_serie"
                    id="num_serie"
                    value={formData.num_serie || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Número OC</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="num_oc"
                    id="num_oc"
                    value={formData.num_oc || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Número de Cotización</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="num_cot"
                    id="num_cot"
                    value={formData.num_cot || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Número de Factura</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="num_fac"
                    id="num_fac"
                    value={formData.num_fac || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              {/* Sección de Horas */}
              <tr className={styles.sectionHeader}>
                <td colSpan={2}>Horas de Trabajo</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Horas de Diseño Mecánico</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="mechanical_design_hours"
                    id="mechanical_design_hours"
                    value={formData.mechanical_design_hours || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Horas de Diseño Eléctrico</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="electrical_design_hours"
                    id="electrical_design_hours"
                    value={formData.electrical_design_hours || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>
                  Horas de Ensamblaje y Desarrollo
                </td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="assembly_dev_hours"
                    id="assembly_dev_hours"
                    value={formData.assembly_dev_hours || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Horas de Programación</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="programming_hours"
                    id="programming_hours"
                    value={formData.programming_hours || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Otras Horas</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="other_hours"
                    id="other_hours"
                    value={formData.other_hours || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              {/* Sección de Métricas */}
              <tr className={styles.sectionHeader}>
                <td colSpan={2}>Métricas y Conteos</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Cantidad de Trabajos</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="jobs_count"
                    id="jobs_count"
                    value={formData.jobs_count || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Cantidad de Semanas</td>
                <td className={styles.fieldValue}>
                  <input
                    type="number"
                    className={`${styles.formInput} ${styles.numericInput}`}
                    name="weeks_count"
                    id="weeks_count"
                    value={formData.weeks_count || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              {/* Sección de Responsables */}
              <tr className={styles.sectionHeader}>
                <td colSpan={2}>Responsables</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Gerente de Proyecto</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="project_manager"
                    id="project_manager"
                    value={formData.project_manager || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Diseñador Mecánico</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="mechanical_designer"
                    id="mechanical_designer"
                    value={formData.mechanical_designer || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Diseñador Eléctrico</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="electrical_designer"
                    id="electrical_designer"
                    value={formData.electrical_designer || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Desarrollador</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="developer"
                    id="developer"
                    value={formData.developer || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.fieldName}>Ensamblador</td>
                <td className={styles.fieldValue}>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="assembler"
                    id="assembler"
                    value={formData.assembler || ""}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </section>
    </article>
  );
}
