import { RadioButton } from "primereact/radiobutton";
import styles from "./projectForm.module.css";
import { ProjectFormData, ProjectType } from "@/utils/types/projectDetail";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Tag } from 'primereact/tag';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  projectTypes: ProjectType[];
};

export function ProjectTypeSelector({
  projectFormData,
  setProjectFormData,
  projectTypes,
}: Props) {

  const handleSelectProjectType = (projectType: string) => {
    const typeSelected = projectTypes.find(
      (type) => type.id === projectType
    );

    if (!typeSelected) {
      return;
    }

    const projectIdentifier = `${typeSelected.prefix.trim()}${(typeSelected.currentCounter + 1)
      .toString()
      .padStart(5, "0")
      .trim()
    }`;
      
    setProjectFormData({
      ...projectFormData,
      projectFolio: projectIdentifier,
      typeProject: projectType,
    });
  };

  return (
    <>
      <div className={styles.projectTypeContainer}>
        <div className={styles.projectType}>
          <RadioButton
            inputId="type-creation"
            name="type-creation"
            value="manual"
            checked={projectFormData.typeCreated === "manual"}
            onChange={(e) =>
              setProjectFormData({ ...projectFormData, typeCreated: e.value, projectFolio: "" })
            }
          />
          <label htmlFor="type-creation">Manual</label>
        </div>

        <div className={styles.projectType}>
          <RadioButton
            inputId="type-creation"
            name="type-creation"
            value="automatic"
            checked={projectFormData.typeCreated === "automatic"}
            onChange={(e) =>
              setProjectFormData({ ...projectFormData, typeCreated: e.value, projectFolio: "" })
            }
          />
          <label htmlFor="type-creation">Automático</label>
        </div>
      </div>

      {projectFormData.typeCreated === "automatic" && (
        <article className={styles.projectTypeGenerator}>
          <select
            name="project-type"
            id="project-type"
            className={styles.dropdown}
            value={projectFormData.typeProject}
            onChange={(e) => handleSelectProjectType(e.target.value)}
          >
            <option value="">Tipo de proyecto</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.title}
              </option>
            ))}
          </select>
          {projectFormData.projectFolio && <Tag value={projectFormData.projectFolio} className={styles.tagFolio}></Tag>}
        </article>
      )}

      {projectFormData.typeCreated === "manual" && (
        <article className={styles.projectTypeGeneratorManual}>
          <FloatLabel>
            <InputText
              id="project-folio"
              value={projectFormData.projectFolio}
              onChange={(e) =>
                setProjectFormData({
                  ...projectFormData,
                  projectFolio: e.target.value,
                })
              }
              className={styles.inputText}
            />
            <label htmlFor="project-folio" className={styles.inputTextLabel}>
              Folio del proyecto
            </label>
          </FloatLabel>
        </article>
      )}
    </>
  );
}
