import { ProjectFormData, QuoteItem } from '@/utils/types/projectDetail';
import styles from './projectForm.module.css';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
};

export function ProjectData({ projectFormData, setProjectFormData }: Props) {
  return (
          <section className={styles.projectInfo}>
        <FloatLabel>
          <InputText
            id="project-name"
            value={projectFormData.projectName}
            onChange={(e) =>
              setProjectFormData({
                ...projectFormData,
                projectName: e.target.value,
              })
            }
            className={styles.inputText}
          />
          <label htmlFor="project-name" className={styles.inputTextLabel}>
            Nombre del proyecto
          </label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            id="project-description"
            defaultValue={projectFormData.quoteItem?.proyectName}
            disabled
            variant="filled"
            className={styles.inputText}
          />
          <label
            htmlFor="project-description"
            className={styles.inputTextLabel}
          >
            Descripción del proyecto
          </label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            id="quote-number"
            value={projectFormData.quoteItem?.quote}
            className={styles.inputText}
            onChange={(e) =>
              setProjectFormData({
                ...projectFormData,
                quoteItem: {
                  ...projectFormData.quoteItem,
                  quote: e.target.value,
                } as QuoteItem,
              })
            }
          />
          <label htmlFor="quote-number" className={styles.inputTextLabel}>
            Número de cotización
          </label>
        </FloatLabel>
      </section>
  );
}