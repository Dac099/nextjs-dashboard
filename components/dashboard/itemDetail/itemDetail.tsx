'use client';
import styles from './itemDetail.module.css';
import {useSearchParams, useRouter} from "next/navigation";
import {useEffect, useState, useRef, RefObject} from "react";
import useClickOutside from "@/hooks/useClickOutside";
import {Item, ProjectData, ResponseChats} from "@/utils/types/items";
import { getProjectData, getItemDetail, getItemChats } from '@/actions/items';
import { Skeleton } from '@/components/common/skeleton/skeleton';
import { formatDate } from '@/utils/helpers';
import { ChatsContainer } from '@/components/common/chatsContainer/chatsContainer';
import { LogsContainer } from '@/components/common/logsContainer/logsContainer';
import { ProjectContainer } from '@/components/common/projectContainer/projectContainer';
import { PiChatsFill } from "react-icons/pi";
import { LuLogs } from "react-icons/lu";
import { SiGoogleforms } from "react-icons/si";

export function ItemDetail(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemId = searchParams.get('itemId');
    const containerRef = useRef<HTMLDivElement>(null);
    const [showContainer, setShowContainer] = useState(false)
    const [chatData, setChatData] = useState<ResponseChats>({} as ResponseChats);
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [itemDetail, setItemDetail] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [onError, setOnError] = useState<boolean>(false);
    const [viewSelected, setViewSelected] = useState<string>('projectDetail');

    function closeContainer(): void{
        const path = new URLSearchParams(searchParams.toString());
        path.delete('itemId');
    
        const newURL = path.toString() ? `?${path.toString()}` : '';
    
        router.push(`${window.location.pathname}${newURL}`);
        setShowContainer(false);
        setIsLoading(true);
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
            })
            .finally(() => setIsLoading(false))
            .catch(() => setOnError(true));            
        }
    }, [itemId]);

    if(showContainer){
        return (
            <article
                ref={containerRef}
                className={styles.container}
            >
                {!isLoading && 
                    <>
                        <section className={styles.loaderHeader}>
                            <p>{itemDetail[0].name}</p>
                            <p>{formatDate(itemDetail[0].created_at)}</p>
                        </section>

                        <section className={styles.loaderViews}>
                            <article 
                                className={`${styles.viewBtn} ${viewSelected == 'chats' ? styles.viewBtnSelected : ''}`}
                                onClick={() => setViewSelected('chats')}
                            >
                                <PiChatsFill size={20}/>
                                Chats
                            </article>

                            <article 
                                className={`${styles.viewBtn} ${viewSelected == 'projectDetail' ? styles.viewBtnSelected : ''}`}
                                onClick={() => setViewSelected('projectDetail')}
                            >
                                <SiGoogleforms size={20}/>
                                Detalle del proyecto
                            </article>

                            <article 
                                className={`${styles.viewBtn} ${viewSelected == 'logs' ? styles.viewBtnSelected : ''}`}
                                onClick={() => setViewSelected('logs')}
                            >
                                <LuLogs size={20}/>
                                Logs
                            </article>
                        </section>
                        <hr className={styles.division}/>


                        <section className={styles.loaderContent}>
                            {viewSelected === 'chats' && <ChatsContainer />}
                            {viewSelected === 'projectDetail' && <ProjectContainer data={projectData[0]}/>}
                            {viewSelected === 'logs' && <LogsContainer />}
                        </section>
                    </>
                }
                {isLoading && <Loader />}
            </article>
        );
    }
}

const Loader = () => (
    <>
        <section className={styles.loaderHeader}>
            <Skeleton width='100%' height='100%' rounded='5px'/>
            <Skeleton width='100%' height='100%' rounded='5px'/>
        </section>

        <section className={styles.loaderViews}>
            <Skeleton width='100px' height='25px' rounded='5px'/>
            <Skeleton width='100px' height='25px' rounded='5px'/>
            <Skeleton width='100px' height='25px' rounded='5px'/>
        </section>
        <hr className={styles.division}/>

        <section className={styles.loaderContent}>
            <Skeleton width='700px' height='250px' rounded='5px'/>
            <Skeleton width='700px' height='250px' rounded='5px'/>
        </section>
    </>
);