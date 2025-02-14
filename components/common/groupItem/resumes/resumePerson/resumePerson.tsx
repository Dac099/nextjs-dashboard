import { ItemData } from '@/utils/common/types';
import styles from './styles.module.css';
import { IoPersonCircle } from "react-icons/io5";
import Image from 'next/image';

type Props = {
  groupId: string;
  propertyTitle: string;
};

export const ResumePerson = ({groupId, propertyTitle}: Props) => {
  const filteredItems = items.map((item) => item.properties).flat().filter((item) => item.propertyTitle === propertyTitle);
  const definedTitle = filteredItems[0].userTitle || filteredItems[0].propertyTitle;
  console.log(filteredItems);
  return (
    <article className={styles.container}>
      <p>{definedTitle}</p>
      <section className={styles['pictures-container']}>
        {
          filteredItems.map((item) => (
            <article key={item.id}>
              {
                item.userName 
                  ? <Image 
                      src={item.userName} 
                      alt='Foto de perfil de empleado de YNE'
                      width={20}
                      height={20}
                      className={styles.circle}
                    />
                  : <IoPersonCircle />
              }
            </article>
          ))
        }
      </section>
    </article>
  );
}