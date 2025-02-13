import styles from './styles.module.css';
import { GroupData } from '@/utils/common/types';
import { IoIosArrowDown } from "react-icons/io";
import { ResumeStatus } from './resumes/resumeStatus/resumeStatus';
import { ResumeNumber } from './resumes/resumeNumber/resumeNumber';
import { ResumePerson } from './resumes/resumePerson/resumePerson';
import {RowItem} from "@/components/common/groupItem/rowItem/rowItem";

type Props = {
  group: GroupData;
};

export async function GroupItemTable({ group }: Props){
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if(!isOpen){
    return (
      <article 
        className={`${styles.container} ${styles['container--closed']}`} 
        style={{borderLeft: `8px solid ${group.color}`}}
      >
        <section className={styles['header--closed']}>
          
          <section className={styles.header}>
            <IoIosArrowDown
              className={`${styles.icon} ${!isOpen ? styles['icon--closed'] : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              style={{color: group.color}}              
            />
            <p style={{color: group.color}}>{group.title}</p>
          </section>

          <span>
            {`${group.items.length} ${group.items.length > 1 ? 'Elementos' : 'Elemento'}`}
          </span>

        </section>

        <section className={styles['properties--closed']}>
          {
            groupProperties.map((property) => {
              switch(property.type){
                case 'Number':
                  return (
                    <ResumeNumber 
                      key={property.id}
                      items={group.items}
                      propertyTitle={property.propertyTitle}
                    />
                  );
                case 'Status':
                  return (
                    <ResumeStatus 
                      key={property.id} 
                      items={group.items} 
                      propertyTitle={property.propertyTitle}
                    />
                  );
                case 'User':
                  return (
                    <ResumePerson 
                      key={property.id} 
                      items={group.items} 
                      propertyTitle={property.propertyTitle}
                    />
                  );
              }

              return (<div key={property.id} className={styles['empty-column']}></div>);
            })
          }
        </section>

      </article>
    );
  }

  return (
    <article>
      <section className={`${styles.header} ${styles['header--open']}`} style={{color: group.color}}>
        <IoIosArrowDown 
          className={`${styles.icon} ${!isOpen ? styles['icon--closed'] : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        />
        <p>{group.title}</p>
      </section>

      <section 
        className={`${styles.container} ${styles['container--open']}`}
        style={{borderLeft: `8px solid ${group.color}`}}
      >
        <article
          className={styles.row}
        >
          <div className={styles.checkbox}>
            <input 
              type="checkbox" 
              name="" 
              id="" 
              onChange={(e) => setSelectAll(e.target.checked)}
            />
          </div>

          <div className={styles['row-header']}>
            <p>Proyecto</p>
          </div>

          {
            groupProperties.map(property => (
              <div key={property.id} className={styles['row-header']}>
                <p>{property.userTitle || property.propertyTitle}</p>
              </div>
            ))
          }
        </article>
        {
          group.items.map(item => (
            <RowItem item={item} key={item.id} />
          ))
        }
      </section>

    </article>
  );
}