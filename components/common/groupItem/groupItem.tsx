'use client';

import styles from './styles.module.css';
import { Format, GroupData } from '@/utils/common/types';
import { IoIosArrowDown } from "react-icons/io";
import { useState } from 'react';
import { ResumeStatus } from './resumes/resumeStatus/resumeStatus';

type Props = {
  group: GroupData;
};

export const GroupItemTable = ({ group }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const groupProperties = group.items[0].properties;

  const getCharacterFromFormat = new Map<Format, string>([
    ['Currency', '$'],
    ['Count', '#'],
    ['Porcentual', '%'],
  ]);

  if(!isOpen){
    return (
      <article 
        className={`${styles.container} ${styles['container--closed']}`} 
        style={{borderLeft: `5px solid ${group.color}`}}
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
                  return (<p key={property.id}>{property.userTitle || property.propertyTitle}</p>);
                case 'Status':
                  return <ResumeStatus key={property.id} items={group.items}/>;
                case 'User':
                  return (<p key={property.id}>{property.userTitle || property.propertyTitle}</p>);
              }

              return (<div key={property.id} className={styles['empty-column']}></div>);
            })
          }
        </section>

      </article>
    );
  }

  return (
    <article 
      className={`${styles.container} ${styles['container--open']}`}
      style={{borderLeft: `5px solid ${group.color}`}}
    >
      <section className={`${styles.header} ${styles['header--open']}`}>
        <IoIosArrowDown 
          className={`${styles.icon} ${!isOpen ? styles['icon--closed'] : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        />
        <p>{group.title}</p>
      </section>

      <table className={styles.projectsTable}>
        <thead className={styles.projectsTableHeader}>
          <tr>
            <th>
              <input type='checkbox'/>
            </th>
            <th>Proyecto</th>
            {
              groupProperties.map((property) => (
                <th key={property.id}> 
                  {property.format ? getCharacterFromFormat.get(property.format) : ''} 
                  {property.userTitle || property.propertyTitle}
                </th>
              ))
            }
          </tr>
        </thead>

        <tbody>
          {
            group.items.map((item) => (
              <tr key={item.id}>
                <td><input type='checkbox'/></td>
                <td>
                  <section>
                    {item.title}
                  </section>
                  <section>
                    <div>{item.completedTasks} / {item.totalTasks}</div>
                    <div>{item.chats.length}</div>
                  </section>
                </td>
                {
                  item.properties.map((property) => {
                    switch(property.type){
                      case 'Number':
                        return (<td key={property.id}>{property.value}</td>);
                      case 'Status':
                        return (<td key={property.id}>{property.value}</td>);
                      case 'User':
                        return (<td key={property.id}>{property.userName}</td>);
                      case 'Date':
                        return (<td key={property.id}>{property.value}</td>);
                      case 'Text':
                        return (<td key={property.id}>{property.value}</td>);
                      case 'TimeLine':
                        return (<td key={property.id}>{property.startDate} - {property.endDate}</td>);
                    }
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </article>
  );
}