import styles from "./projectForm.module.css";
import { ProjectFormData } from "@/utils/types/projectDetail";
import { FloatLabel } from "primereact/floatlabel";
import { InputTextarea } from "primereact/inputtextarea";

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
};

export function ProjectNotes({ projectFormData, setProjectFormData }: Props) {
  return (
    <section className={styles.formNotes}>
      <FloatLabel>
        <label htmlFor="formNotes" className={styles.inputTextLabel}>
          Notas adicionales
        </label>
        <InputTextarea
          id="formNotes"
          name="formNotes"
          value={projectFormData.notes}
          onChange={(e) =>
            setProjectFormData({ ...projectFormData, notes: e.target.value })
          }
          autoResize
          rows={5}
          cols={100}
          style={{ padding: "0.5rem", marginTop: "10px", fontSize: "1.3rem" }}
        />
      </FloatLabel>
    </section>
  );
}
