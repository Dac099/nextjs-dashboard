'use client';
import { CiSquarePlus } from "react-icons/ci";
import styles from './styles.module.css';
import { useRef, RefObject, useState, useEffect } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { useParams, useRouter } from 'next/navigation';
import type { ViewType } from '@/utils/proyectTemplate/types';
import { getIconByName } from '@/utils/helpers';
import { insertViewPage } from '@/actions/pages';

type Props = {
  viewTypes: ViewType[];
};

export const ModalViewBar = ({ viewTypes }: Props) => {
  const router = useRouter();
  const params = useParams();
  const refContainer = useRef<HTMLDivElement>(null);
  const [ showModal, setShowModal ] = useState<boolean>(false);
  const currentView = params.view_id as string;
  const pageId = params.page_id as string;
  
  // useEffect(() => {
  //   setShowModal(false);
  // }, [currentView]);

  const handleInsertView = async(pageId: string, typeName: string, pageName: string) => {
    const response = await insertViewPage(pageId, typeName, pageName);
    
    if(response instanceof Error){
      alert('Ocurrió un error al guardar la vista');
      return;
    }
    
    router.push(`/projects/${pageId}/${response}`);
  }

  useClickOutside(refContainer as RefObject<HTMLDivElement>, () => {
    setShowModal(false);
  });
  return (
    <article 
      className={styles.modalContainer}
      onClick={() => setShowModal(true)}
    >
      <CiSquarePlus size={25}/>
      {showModal &&      
        <section className={styles.modalControls} ref={refContainer}>
          {viewTypes.map((viewType: ViewType) => (
            <p 
              key={viewType.name}
              className={styles['modal-control']}
              onClick={() => handleInsertView(pageId, viewType.name, viewType.name)}
            >
              <span className={styles['modal-icon']}>
                {getIconByName(viewType.icon)}
              </span>
              {viewType.name}
            </p>
          ))}
        </section>
      }
    </article>
  );
};