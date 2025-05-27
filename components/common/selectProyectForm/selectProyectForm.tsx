import styles from "./selectProyectFrom.module.css";
import { ProjectSearchBar } from "../projectSearchBar/projectSearchBar";
import { useEffect, useState } from "react";
import { Skeleton } from "../skeleton/skeleton";
import { useParams } from "next/navigation";
import {
  addItemByProject,
  getAllProjects,
  getProjectData,
} from "@/actions/items";
import { Project, ProjectData } from "@/utils/types/items";
import { formatDate } from "@/utils/helpers";

type Props = {
  closeContainer: () => void;
  groupId: string;
};

export function SelectProyectForm({ closeContainer, groupId }: Props) {
  const { id: boardId, viewId } = useParams();
  const [loadingItems, setLoadingItem] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const itemsSkeleton = Array.from({ length: 36 }).fill(0);
  const [projectData, setProjectData] = useState<ProjectData | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [onError, setOnError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const projects: Project[] = await getAllProjects();
        setAllProjects(projects);
      } catch (error) {
        console.log(error);
        setOnError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [boardId, groupId]);

  useEffect(() => {
    async function fetchData() {
      if (selectedProject) {
        setLoadingItem(true);
        const project = await getProjectData(selectedProject.id);
        setProjectData(project[0]);
        console.log(project[0]);
      } else {
        setLoadingItem(true);
      }
    }
    fetchData().finally(() => setLoadingItem(false));
  }, [selectedProject]);

  async function handleChoseProyect() {
    await addItemByProject(
      groupId,
      viewId as string,
      boardId as string,
      selectedProject!.id,
      selectedProject!.id
    );
    closeContainer();
  }

  if (onError) {
    return (
      <p className={styles.errorTitle}>
        Ocurrió un error obteniendo la información
      </p>
    );
  }

  if (loading) {
    return (
      <section>
        <section className={styles.loadingSearchBarTitle}>
          <Skeleton width="330px" height="30px" rounded="5px" />
        </section>
        <section className={styles.loadingSearchBarField}>
          <Skeleton width="230px" height="35px" rounded="5px" />
        </section>
      </section>
    );
  }

  return (
    <article className={styles.searcher}>
      <p>Empieza seleccionado un proyecto</p>
      <article>
        <ProjectSearchBar
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          data={allProjects}
        />
      </article>

      {loadingItems && (
        <>
          <Skeleton width="115px" height="30px" rounded="5px" />

          <section className={styles.projectInfoGrid}>
            {itemsSkeleton.map((item, index) => (
              <div className={styles.infoItem} key={index}>
                <Skeleton width="100%" height="100%" rounded="5px" />
              </div>
            ))}
          </section>
        </>
      )}

      {selectedProject && projectData && !loadingItems && (
        <>
          <button
            type="button"
            onClick={() => handleChoseProyect()}
            className={styles.chooseBtn}
          >
            Elegir Proyecto
          </button>

          <section className={styles.projectInfoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>ID:</p>
              <p className={styles.infoValue}>
                {projectData.id || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Nombre:</p>
              <p className={styles.infoValue}>
                {projectData.name || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Descripción:</p>
              <p className={styles.infoValue}>
                {projectData.description || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Cliente:</p>
              <p className={styles.infoValue}>
                {projectData.client || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Creado por:</p>
              <p className={styles.infoValue}>
                {projectData.created_by || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Tipo:</p>
              <p className={styles.infoValue}>
                {projectData.type || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Estado:</p>
              <p className={styles.infoValue}>
                {projectData.state || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>División:</p>
              <p className={styles.infoValue}>
                {projectData.division || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Presupuesto inicial:</p>
              <p className={styles.infoValue}>
                {projectData.initial_budget || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Moneda:</p>
              <p className={styles.infoValue}>
                {projectData.currency || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Fecha de inicio:</p>
              <p className={styles.infoValue}>
                {projectData.beginning_date
                  ? formatDate(projectData.beginning_date)
                  : "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Fecha de finalización:</p>
              <p className={styles.infoValue}>
                {projectData.end_date
                  ? formatDate(projectData.end_date)
                  : "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Fecha de creación:</p>
              <p className={styles.infoValue}>
                {projectData.created_at
                  ? formatDate(projectData.created_at)
                  : "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Kickoff:</p>
              <p className={styles.infoValue}>
                {projectData["kickoff"]
                  ? formatDate(projectData["kickoff"])
                  : "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Nota:</p>
              <p className={styles.infoValue}>
                {projectData.note || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Número de serie:</p>
              <p className={styles.infoValue}>
                {projectData["num_serie"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Número OC:</p>
              <p className={styles.infoValue}>
                {projectData["num_oc"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Número de cotización:</p>
              <p className={styles.infoValue}>
                {projectData["num_cot"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Número de factura:</p>
              <p className={styles.infoValue}>
                {projectData["num_fac"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Presupuesto mecánico:</p>
              <p className={styles.infoValue}>
                {projectData["mechanical_budget"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Presupuesto de máquina:</p>
              <p className={styles.infoValue}>
                {projectData["machine_budget"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Presupuesto eléctrico:</p>
              <p className={styles.infoValue}>
                {projectData["electrical_budget"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Otros presupuestos:</p>
              <p className={styles.infoValue}>
                {projectData["other_budget"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Cantidad de trabajos:</p>
              <p className={styles.infoValue}>
                {projectData["jobs_count"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Horas de diseño mecánico:</p>
              <p className={styles.infoValue}>
                {projectData["mechanical_design_hours"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Horas de diseño eléctrico:</p>
              <p className={styles.infoValue}>
                {projectData["electrical_design_hours"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>
                Horas de desarrollo de ensamblaje:
              </p>
              <p className={styles.infoValue}>
                {projectData["assembly_dev_hours"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Horas de programación:</p>
              <p className={styles.infoValue}>
                {projectData["programming_hours"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Otras horas:</p>
              <p className={styles.infoValue}>
                {projectData["other_hours"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Cantidad de semanas:</p>
              <p className={styles.infoValue}>
                {projectData["weeks_count"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Gerente de proyecto:</p>
              <p className={styles.infoValue}>
                {projectData["project_manager"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Diseñador mecánico:</p>
              <p className={styles.infoValue}>
                {projectData["mechanical_designer"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Diseñador eléctrico:</p>
              <p className={styles.infoValue}>
                {projectData["electrical_designer"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Desarrollador:</p>
              <p className={styles.infoValue}>
                {projectData["developer"] || "Sin definir"}
              </p>
            </div>

            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Ensamblador:</p>
              <p className={styles.infoValue}>
                {projectData["assembler"] || "Sin definir"}
              </p>
            </div>
          </section>
        </>
      )}
    </article>
  );
}
