'use client';
import styles from './itemDetail.module.css';
import {useParams, useSearchParams, useRouter} from "next/navigation";
import {useEffect, useState, useRef, RefObject} from "react";
import useClickOutside from "@/hooks/useClickOutside";
import {Item, ProjectData, ResponseChats} from "@/utils/types/items";
import { getProjectData, getItemDetail, getItemChats } from '@/actions/items';

export function ItemDetail(){
    const {id: boardId, viewId} = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemId = searchParams.get('itemId');
    const containerRef = useRef<HTMLDivElement>(null);
    const [showContainer, setShowContainer] = useState(false)
    const [chatData, setChatData] = useState<ResponseChats>({} as ResponseChats);
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [itemDetail, setItemDetail] = useState<Item[]>([]);

    function closeContainer(): void{
        const path = new URLSearchParams(searchParams.toString());
        path.delete('itemId');
    
        const newURL = path.toString() ? `?${path.toString()}` : '';
    
        router.push(`${window.location.pathname}${newURL}`);
        setShowContainer(false);
    }

    useClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
        closeContainer();
    });

    useEffect(() => {
        async function fetchData(itemId: string): Promise<[ResponseChats, ProjectData[], Item[]]>{
            return await Promise.all([
                getItemChats(itemId), 
                getProjectData(itemId), 
                getItemDetail(itemId)
            ]);            
        }

        if(itemId){
            setShowContainer(true);
            fetchData(itemId)
            .then(([chats, project, item]) => {
                setChatData(chats);
                setProjectData(project);
                setItemDetail(item);
                console.log(chats, project, item);
            })
            .catch(error => console.log(error));
        }
    }, [itemId]);

    if(showContainer){
        return (
            <article
                ref={containerRef}
                className={styles.container}
            >
                <section className={styles.containerHeader}>
                    <p className={styles.title}>
                        {itemDetail[0]?.name || 'Proyecto'}
                    </p>
                    <section className={styles.containerViews}>
                        
                    </section>
                </section>
                <section className={styles.containerBody}>

                </section>
            </article>
        );
    }
}