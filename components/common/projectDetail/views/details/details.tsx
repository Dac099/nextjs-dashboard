import styles from './styles.module.css';
import type { ProjectType } from '@/actions/items';

type Props = {
  detail: ProjectType;
};

export const Details = ({ detail }: Props) => {
  
  if(!detail) {
    <section className={styles.searchContainer}>
      
    </section>
  }


  return (
    <article className={styles.container}>
      <p className={styles['container-title']}>Proyecto</p>
      <section className={styles['project-container']}>
        <section className={styles['text-field']}>
          <label htmlFor="">Folio del proyecto</label>
          <input type="text"/>
        </section>

        <section className={styles['text-field']}>
          <label htmlFor="">Tipo</label>
          <input type="text"/>
        </section>
      
        <section className={styles['text-field']}>
          <label htmlFor="">Cantidad de Jobs</label>
          <input type="text"/>
        </section>
     
        <section className={styles['boolean-field']}>
          <label htmlFor="">Fechas iguales</label>
          <input type="checkbox"/>
        </section>

        <section className={styles['text-field']}>
          <label htmlFor="">Nombre del proyecto</label>
          <input type="text"/>
        </section>
      
        <section className={styles['text-field']}>
          <label htmlFor="">Desc. del proyecto</label>
          <input type="text"/>
        </section>

        <section className={styles['text-field']}>
          <label htmlFor="">Sector</label>
          <input type="text"/>
        </section>

      </section>      

      <p className={styles['container-title']}>Cotización</p>
      <section className={styles['budget-container']}>
        <section className={styles['text-field']}>
          <label htmlFor="">Cliente</label>
          <input type="text"/>
        </section>

        <section className={styles['text-field']}>
          <label htmlFor="">Num. Cotización</label>
          <input type="text"/>
        </section>

        <section className={styles['text-field']}>
          <label htmlFor="">PO Cliente</label>
          <input type="text"/>
        </section>

        <section className={styles['text-field']}>
          <label htmlFor="">Presupuesto total</label>
          <input type="text"/>
        </section>
     
        <section className={styles['text-field']}>
          <label htmlFor="">Semanas propuestas</label>
          <input type="text"/>
        </section>
     
        <section className={styles['text-field']}>
          <label htmlFor="">Moneda</label>
          <input type="text"/>
        </section>
      </section>

      <p className={styles['container-title']}>Fechas</p>
      <section className={styles['dates-container']}>
        <section className={styles['text-field']}>
          <label htmlFor="">Fecha PO</label>
          <input type="text"/>
        </section>

        <section className={styles['text-field']}>
          <label htmlFor="">Fecha fin</label>
          <input type="text"/>
        </section>
        
        <section className={styles['text-field']}>
          <label htmlFor="">Fecha kickoff</label>
          <input type="text"/>
        </section>
      </section>
    </article>
  );
}