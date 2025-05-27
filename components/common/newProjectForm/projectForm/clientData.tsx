import { FloatLabel } from 'primereact/floatlabel';
import styles from './projectForm.module.css';
import { InputText } from 'primereact/inputtext';
import { ProjectFormData, OCQuote } from '@/utils/types/projectDetail';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  quotePOS: OCQuote[];
};

export function ClientData({ projectFormData, setProjectFormData, quotePOS }: Props) {
  return (
    <section className={styles.projectInfo}>
      <FloatLabel>
        <InputText
          id="client-name"
          value={projectFormData.quoteItem?.clientName}
          variant="filled"
          disabled
          className={styles.inputText}
        />
        <label htmlFor="client-name" className={styles.inputTextLabel}>
          Nombre del cliente
        </label>
      </FloatLabel>

      <section>
        <label htmlFor="client-po" className={styles.inputTextLabel}>
          PO Cliente
        </label>

        <select
          name="client-po"
          id="client-po"
          className={styles.dropdown}
          onChange={(e) =>
            setProjectFormData({
              ...projectFormData,
              poClient: e.target.value,
            })
          }
        >
          <option value="">Seleccione una opción</option>
          {quotePOS.map((po) => (
            <option value={po.id} key={po.id}>
              {po.poClient}
            </option>
          ))}
        </select>
      </section>
    </section>
  );
}