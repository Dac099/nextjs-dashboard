import { ProjectFormData, SectorItem } from "@/utils/types/projectDetail";
import styles from "./projectForm.module.css";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  sectors: SectorItem[];
};

export function BillingData({
  projectFormData,
  setProjectFormData,
  sectors,
}: Props) {
  return (
    <section className={styles.projectInfo}>
      <article>
        <label htmlFor="sector" className={styles.inputTextLabel}>
          Sector
        </label>
        <select
          name="sector"
          id="sector"
          className={styles.dropdown}
          value={projectFormData.sector}
          onChange={(e) =>
            setProjectFormData({ ...projectFormData, sector: e.target.value })
          }
        >
          <option value="">Seleccione una opción</option>
          {sectors.map((sector) => (
            <option key={sector.id} value={sector.id}>
              {sector.name}
            </option>
          ))}
        </select>
      </article>

      <article>
        <label htmlFor="estatus" className={styles.inputTextLabel}>
          Estado actual
        </label>
        <select
          name="estatus"
          id="estatus"
          className={styles.dropdown}
          value={projectFormData.status}
          onChange={(e) =>
            setProjectFormData({ ...projectFormData, status: e.target.value })
          }
        >
          <option value="">Selecciona opción</option>
          <option value="OP        ">Abierto</option>
          <option value="PRO       ">En proceso</option>
          <option value="CL       ">Cerrado</option>
          <option value="CAN       ">Cancelado</option>
        </select>
      </article>

      <article style={{ paddingTop: "7px" }}>
        <FloatLabel>
          <InputText
            id="bill-number"
            value={projectFormData.billNumber}
            onChange={(e) =>
              setProjectFormData({
                ...projectFormData,
                billNumber: e.target.value,
              })
            }
            className={styles.inputText}
          />
          <label htmlFor="bill-number" className={styles.inputTextLabel}>
            Número de factura
          </label>
        </FloatLabel>
      </article>
    </section>
  );
}
