import { ProjectFormData } from '@/utils/types/projectDetail';
import styles from './projectForm.module.css';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
};

export function ConfigurationJob({ projectFormData, setProjectFormData }: Props) {
  return (
    <>
    <FloatLabel>
        <InputText
          keyfilter={"int"}
          id="jobs-quantity"
          value={
            isNaN(projectFormData.jobsQuantity)
              ? ""
              : projectFormData.jobsQuantity.toString()
          }
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setProjectFormData({ ...projectFormData, jobsQuantity: value });
          }}
          className={styles.inputText}
          min={1}
        />
        <label htmlFor="jobs-quantity" className={styles.inputTextLabel}>
          Cantidad de jobs
        </label>
      </FloatLabel>

      <section className={styles.switchSelection}>
        <label htmlFor="equal-dates" className={styles.inputTextLabel}>
          Fechas iguales
        </label>
        <InputSwitch
          id="equal-dates"
          checked={projectFormData.equalDates}
          onChange={(e) =>
            setProjectFormData({ ...projectFormData, equalDates: e.value })
          }
          className={styles.inputSwitch}
        />
      </section>
    </>
  );
}