'use client';

import styles from './styles.module.css'
import { FaArrowRightLong } from "react-icons/fa6";
import { useItemSelected } from "@/stores/detailItemStore";
import { useState, useRef, RefObject, useEffect } from "react";
import useClickOutside from '@/hooks/useClickOutside';
import { DetailBar } from './detailBar/detailBar';
import { DetailView } from '@/utils/common/types';
import { Chats } from './views/chats/chats';
import { Files } from './views/files/files';
import { Details } from './views/details/details';

export const ProjectDetail = () => {
    const itemStore = useItemSelected();
    const [ updateTitle, setUpdateTitle ] = useState<boolean>(false);
    const containerRef = useRef<HTMLElement>(null);
    const inputElementRef = useRef<HTMLInputElement>(null);
    const [ viewSelected, setViewSelected ] = useState<DetailView>('chats');

    useEffect(() => {
        if(updateTitle) {
            inputElementRef.current?.focus();
            inputElementRef.current?.select();
        }
    }, [updateTitle]);

    useClickOutside(containerRef as RefObject<HTMLElement>, () => {
        setUpdateTitle(false);
    });

    return (
        <article className={`${styles.container} ${!itemStore.showModal ? styles['container--backward'] : ''}`}>            
            <section className={styles.header}>
                <section>
                    <FaArrowRightLong
                        className={styles.icon}
                        size={18}
                        onClick={() => itemStore.setShowModal(false)}
                    />
                </section>
                <section ref={containerRef}>
                    {updateTitle
                        ? (
                            <input 
                                type="text"
                                onBlur={() => {
                                    console.log('Ejecutando server action')
                                }}
                                className={styles['input-title']}
                                defaultValue={itemStore.item?.title || 'Nombre de proyecto'}    
                                ref={inputElementRef}                            
                            />
                        )
                        : (
                            <p 
                                className={styles.title}
                                onClick={() => setUpdateTitle(true)}
                            >
                                {itemStore.item?.title || 'Nombre de proyecto'}
                            </p>
                        )
                    }
                </section>
                <section>
                    <DetailBar setViewSelected={setViewSelected} viewSelected={viewSelected}/>
                </section>
            </section>
            <section className={styles.body}>
                {viewSelected === 'chats' && <Chats chats={itemStore.item?.chats}/>}
                {viewSelected === 'files' && <Files itemId={itemStore.item?.id}/>}
                {viewSelected === 'projectDetail' && <Details />}
            </section>
        </article>
    );
}