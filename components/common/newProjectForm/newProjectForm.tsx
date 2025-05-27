import styles from './newProjectForm.module.css';
import { useState } from 'react';
import type { QuoteItem, ProjectFormData } from '@/utils/types/projectDetail';
import { Steps } from 'primereact/steps';
import { MenuItem } from 'primereact/menuitem';
import { QuoteSelector } from './QuoteSelector/QuoteSelector';
import { ProjectForm } from './projectForm/projectForm';
import { ProjectColumns } from './projectColumns/projectColumns';

type Props = {
  groupId: string;
  closeContainer: () => void;
};

export function NewProjectForm({ groupId, closeContainer }: Props) {
  const [formStep, setFormStep] = useState<'quotes' | 'projectInfo' | 'boardColumns'>('quotes');
  const [quoteSelected, setQuoteSelected] = useState<QuoteItem | null>(null);
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    typeCreated: 'automatic',
    projectFolio: '',
    typeProject: '',
    jobsQuantity: 1,
    equalDates: false,
    projectName: '',
    projectDescription: '',
    poClient: '',
    sector: '',
    poDate: '',
    deadline: '',
    proposedWeeks: 0,
    kickOffDate: '',
    currency: '',
    totalBudget: 0,
    linkDrive: '',
    machines: [],
    status: '',
    notes: '',
    billNumber: '',
    quoteItem: null,
    projectManagerId: '',
    mechanicalDesignerId: '',
    electricalDesignerId: '',
    developerId: '',
    assemblerId: '',
    mechanicalBudget: 0,
    electricalBudget: 0,
    machineBudget: 0,
    otherBudget: 0,
    mechanicalDesignTime: 0,
    electricalDesignTime: 0,
    assemblyTime: 0,
    otherTime: 0,
    developmentTime: 0
  });
  
  // Pasos del asistente
  const steps: MenuItem[] = [
    {
        label: 'Selecciona Cotización',
        command: () => setFormStep('quotes')
    },
    {
        label: 'Información del proyecto',
        command: () => setFormStep('projectInfo')
    },
    {
        label: 'Configuración de columnas',
        command: () => setFormStep('boardColumns')
    }
  ];

  const activeIndex = steps.findIndex(step => {
    if (formStep === 'quotes') return step.label === 'Selecciona Cotización';
    if (formStep === 'projectInfo') return step.label === 'Información del proyecto';
    return step.label === 'Configuración de columnas';
  });

  const handleQuoteSelect = (quote: QuoteItem | null) => {
    setQuoteSelected(quote);
    setProjectFormData({ 
      ...projectFormData, 
      totalBudget: quote?.totalBudget || 0,
      mechanicalBudget: quote?.mechanicalBudget || 0,
      electricalBudget: quote?.electricalBudget || 0,
      machineBudget: quote?.machineBudget || 0,
      otherBudget: quote?.specialComponentsBudget || 0,
      mechanicalDesignTime: quote?.mechanicalDesignTime || 0,
      electricalDesignTime: quote?.electricalDesignTime || 0,
      assemblyTime: quote?.assemblyTime || 0,
      otherTime: quote?.otherTime || 0,
      developmentTime: quote?.developmentTime || 0,
      quoteItem: quote,
      projectDescription: quote?.proyectName || '',
    });
  };

  const handleNextStep = () => {
    setFormStep('projectInfo');
  };

  return (
    <section className={styles.container}>
      <div className={styles.stepsContainer}>
        <Steps model={steps} activeIndex={activeIndex} />
      </div>      
      
      {formStep === 'quotes' && (
        <QuoteSelector 
          onQuoteSelect={handleQuoteSelect}
          selectedQuote={quoteSelected}
          onNextStep={handleNextStep}
          onCancel={closeContainer}
        />
      )}

      {formStep === 'projectInfo' && (
        <ProjectForm 
          projectFormData={projectFormData}
          setProjectFormData={setProjectFormData}
          setFormStep={setFormStep}
        />
      )}

      {formStep === 'boardColumns' && (
        <ProjectColumns
          projectData={projectFormData}
          closeContainer={closeContainer}
          setFormStep={setFormStep}
          groupId={groupId}
        />
      )}

    </section>
  );
}