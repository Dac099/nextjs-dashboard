'use client';
import styles from './itemDetail.module.css';
import {useParams, useSearchParams, useRouter} from "next/navigation";
import {useEffect, useState, useRef, RefObject} from "react";
import useClickOutside from "@/hooks/useClickOutside";
import {ProjectData, ResponseChats} from "@/utils/types/items";
import { getProjectData, getItemDetail, getItemChats } from '@/actions/items';

export function ItemDetail(){
    const {id: boardId, viewId} = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemId = searchParams.get('itemId');
    const containerRef = useRef<HTMLDivElement>(null);
    const [showContainer, setShowContainer] = useState(false)
    const [chatData, setChatData] = useState<ResponseChats | null>();
    const [projectData, setProjectData] = useState<ProjectData | null>();
    const [itemDetail, setItemDetail] = useState<string | null>();

    useClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
        const path = new URLSearchParams(searchParams.toString());
        path.delete('itemId');

        const newURL = path.toString() ? `?${path.toString()}` : '';

        router.push(`${window.location.pathname}${newURL}`);
        setShowContainer(false);
    });

    useEffect(() => {
        if(itemId){
            setShowContainer(true);
            
        }
    }, [itemId]);

    if(showContainer){
        return (
            <article
                ref={containerRef}
                className={styles.container}
            >

            </article>
        );
    }
}