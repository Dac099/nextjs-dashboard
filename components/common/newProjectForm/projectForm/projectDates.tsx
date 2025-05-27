import styles from './projectForm.module.css';
import { InputNumber } from 'primereact/inputnumber';
import { ProjectFormData } from '@/utils/types/projectDetail';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
};

export function ProjectDates({ projectFormData, setProjectFormData }: Props) {
  const calendarPanelStyle = { 
    fontSize: '1.2rem', 
    width: '300px', 
    padding: '10px' 
  };

  return (
    <section className={styles.projectInfo}>
      <FloatLabel>
        <label htmlFor="po-date" className={styles.inputTextLabel}>Fecha PO</label>
        <Calendar 
          inputId='po-date'
          value={projectFormData.poDate ? new Date(projectFormData.poDate) : new Date()}
          onChange={e => setProjectFormData({ ...projectFormData, poDate: e.value?.toISOString() || '' })}
          panelStyle={calendarPanelStyle}
        />
      </FloatLabel>
      
      <FloatLabel>
        <label htmlFor="end-date" className={styles.inputTextLabel}>Fecha Fin</label>
        <Calendar 
          inputId='end-date'
          value={projectFormData.deadline ? new Date(projectFormData.deadline) : new Date()}
          onChange={e => setProjectFormData({ ...projectFormData, deadline: e.value?.toISOString() || '' })}
          panelStyle={calendarPanelStyle}
        />
      </FloatLabel>
      
      <FloatLabel>
        <label htmlFor="kickoff-date" className={styles.inputTextLabel}>Fecha Kickoff</label>
        <Calendar
          inputId='kickoff-date'
          value={projectFormData.kickOffDate ? new Date(projectFormData.kickOffDate) : new Date()}
          onChange={e => setProjectFormData({ ...projectFormData, kickOffDate: e.value?.toISOString() || '' })}
          panelStyle={calendarPanelStyle}
        />
      </FloatLabel>

      <FloatLabel>
        <label htmlFor="defined-weeks" className={styles.inputTextLabel}>Semanas propuestas</label>
        <InputNumber
          className={styles.inputNumber}
          inputId='defined-weeks'
          value={projectFormData.proposedWeeks}
          onValueChange={e => setProjectFormData({ ...projectFormData, proposedWeeks: e.value || 0 })}
          inputStyle={{ paddingLeft: '5px' }}
        />
      </FloatLabel>
    </section>
  );
}