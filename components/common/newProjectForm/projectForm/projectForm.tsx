import styles from "./projectForm.module.css";
import {
  Currency,
  FieldWithEmployees,
  OCQuote,
  ProjectFormData,
  ProjectType,
  SectorItem,
} from "@/utils/types/projectDetail";
import { Button } from "primereact/button";
import {
  getCurrencies,
  getEmployeesByField,
  getPOQuote,
  getProjectTypes,
  getSectors,
} from "@/actions/projectDetail";
import { useEffect, useState, useRef } from "react";
import { ProjectFormSkeleton } from "../projectFormSkeleton/projectFormSkeleton";
import { Toast } from "primereact/toast";
import { ProjectTypeSelector } from "./projectTypeSelector";
import { ConfigurationJob } from "./configurationJob";
import { ClientData } from "./clientData";
import { ProjectData } from "./projectData";
import { BudgetProject } from "./budgetProject";
import { BillingData } from "./billingData";
import { MachinesInput } from "./machinesInput";
import { ProjectDetail } from "./projectDetail";
import { ProjectMachinesDetail } from "./projectMachinesDetail";
import { ProjectNotes } from "./projectNotes";
import { validateProjectBudgetAndTime, validateProjectFormData } from '@/utils/helpers';
import { ProjectDates } from './projectDates';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  setFormStep: (step: "quotes" | "boardColumns") => void;
};

export function ProjectForm({
  projectFormData,
  setProjectFormData,
  setFormStep,
}: Props) {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [quotePOS, setQuotePOS] = useState<OCQuote[]>([]);
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [fieldsWithManagers, setFieldsWithManagers] =
    useState<FieldWithEmployees>({});
  const [loading, setLoading] = useState(true);
  const toastRef = useRef<Toast>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        setLoading(true);
        if (!projectFormData.quoteItem) {
          return;
        }

        const [
          types,
          quotePOS,
          sectorsResult,
          currenciesResult,
          employeesByField,
        ] = await Promise.all([
          getProjectTypes(),
          getPOQuote(projectFormData.quoteItem.quote),
          getSectors(),
          getCurrencies(),
          getEmployeesByField(),
        ]);

        setProjectTypes(types);
        setQuotePOS(quotePOS);
        setSectors(sectorsResult);
        setCurrencies(currenciesResult);
        setFieldsWithManagers(employeesByField);
        setLoading(false);
      } catch (error) {
        console.log(`Ocurrió un error al obtener los valores ${error}`);
        setError("Ocurrió un error al obtener datos del formulario");
        setLoading(false);
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: `Ocurrió un error al obtener los valores del formulario`,
          life: 5000,
        });
      }
    };

    fetchProjectTypes();
  }, [projectFormData.quoteItem]);

  if (loading) return <ProjectFormSkeleton />;

  if (error) {
    return (
      <>
        <ProjectFormSkeleton />
        <Toast ref={toastRef} position="top-right" className="custom-toast" />
      </>
    );
  }

  const handleNextStep = () => {
    const errors = validateProjectFormData(projectFormData);
    
    if (errors.length > 0) {
      errors.forEach((error, index) => {
        toastRef.current?.show({
          severity: "error",
          summary: 'Error',
          detail: error,
          life: index * 1000,
        });
      });

      return;
    }

    const validatedProject = validateProjectBudgetAndTime(projectFormData);
    setProjectFormData(validatedProject);
    setFormStep("boardColumns");
  };

  return (
    <article className={styles.formStep}>
      <ProjectTypeSelector
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
        projectTypes={projectTypes}
      />

      <ConfigurationJob
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
      />

      <hr />

      <ClientData
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
        quotePOS={quotePOS}
      />

      <hr />

      <ProjectData
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
      />

      <hr />

      <ProjectDates
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
      />

      <hr />

      <BudgetProject
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
        currencies={currencies}
      />

      <hr />

      <BillingData
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
        sectors={sectors}
      />

      <hr />

      <MachinesInput
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
        sectors={sectors}
      />

      {projectFormData.machines.length === 0 ? (
        <ProjectDetail
          projectFormData={projectFormData}
          setProjectFormData={setProjectFormData}
          fieldsWithManagers={fieldsWithManagers}
        />
      ) : (
        <ProjectMachinesDetail
          projectFormData={projectFormData}
          setProjectFormData={setProjectFormData}
          fieldsWithManagers={fieldsWithManagers}
        />
      )}

      <ProjectNotes
        projectFormData={projectFormData}
        setProjectFormData={setProjectFormData}
      />


      <div className={styles.buttonContainer}>
        <Button
          label="Atrás"
          icon="pi pi-arrow-left"
          className={`p-button-text ${styles.actionBtn}`}
          onClick={() => setFormStep("quotes")}
        />
        <Button
          label="Siguiente"
          icon="pi pi-arrow-right"
          iconPos="right"
          className={styles.actionBtn}
          onClick={() => handleNextStep()}
        />
      </div>
      <Toast ref={toastRef} position="top-right" />
    </article>
  );
}
