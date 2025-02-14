'use client';

import styles from './styles.module.css'
import { FaArrowRightLong } from "react-icons/fa6";
import { useState, useRef, RefObject, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useClickOutside from '@/hooks/useClickOutside';
import { DetailBar } from './detailBar/detailBar';
import { DetailView } from '@/utils/common/types';
import { Chats } from './views/chats/chats';
// import { Files } from './views/files/files';
import { Details } from './views/details/details';
import { 
    getProjectDetail, 
    type ProjectDetailType,
    updateItemTitle
} from '@/actions/items';

export const ProjectDetail = () => {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();        
    const containerRef = useRef<HTMLElement>(null);
    const inputElementRef = useRef<HTMLInputElement>(null);
    const pageId = params.page_id as string;
    const viewId = params.view_id as string;
    const itemId = searchParams.get('detail');
    const [ viewSelected, setViewSelected ] = useState<DetailView>('chats');
    const [ updateTitle, setUpdateTitle ] = useState<boolean>(false);
    const [ itemData, setItemData ] = useState<ProjectDetailType | null>(null);
    const [ newTitle, setNewTitle ] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            const response = await getProjectDetail(itemId as string);
            if(response instanceof Error) {                
                return;
            }

            setItemData(response);
            setNewTitle(response.title);
        }

        if(itemId) {
            fetchData();
        }
    }, [itemId]);
    
    useEffect(() => {
        if(updateTitle) {
            inputElementRef.current?.focus();
            inputElementRef.current?.select();
        }
    }, [updateTitle]);
    
    useClickOutside(containerRef as RefObject<HTMLElement>, () => {
        setUpdateTitle(false);
    });
    
    if(!itemId) {
        return null;
    }
    return (
        <article className={styles.container}>            
            <section className={styles.header}>
                <section>
                    <FaArrowRightLong
                        className={styles.icon}
                        size={18}
                        onClick={() => {router.push(`/projects/${pageId}/${viewId}`)}}
                    />
                </section>
                <section ref={containerRef}>
                    {updateTitle
                        ? (
                            <input 
                                type="text"
                                className={styles['input-title']}
                                onChange={(e) => setNewTitle(e.target.value)}
                                defaultValue={itemData?.title || 'Proyecto'}    
                                ref={inputElementRef}                            
                            />
                        )
                        : (
                            <p 
                                className={styles.title}
                                onClick={() => setUpdateTitle(true)}
                            >
                                {newTitle}
                            </p>
                        )
                    }
                </section>
                <section>
                    <DetailBar setViewSelected={setViewSelected} viewSelected={viewSelected}/>
                </section>
            </section>
            <section className={styles.body}>
                {viewSelected === 'chats' && <Chats chats={itemData && itemData.chats ? itemData.chats : []}/>}
                {/* {viewSelected === 'files' && <Files itemId={}/>} */}
                {viewSelected === 'projectDetail' && <Details detail={itemData!.projectData}/>}
            </section>
        </article>
    );
}