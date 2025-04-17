'use client';
import styles from './itemDetail.module.css';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, RefObject } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { DetailView } from '@/components/common/detailView/detailView';
import { FormNewItem } from '@/components/common/formNewItem/formNewItem';


export function ItemDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemId = searchParams.get('itemId');
    const isNewProject = searchParams.get('newProject') || false;
    const groupId = searchParams.get('groupId');
    const containerRef = useRef<HTMLDivElement>(null);
    const [showContainer, setShowContainer] = useState(false);


    function closeContainer(): void {
        const path = new URLSearchParams(searchParams.toString());
        path.delete('itemId');
        path.delete('newProject');
        path.delete('groupId');

        const newURL = path.toString() ? `?${path.toString()}` : '';

        router.push(`${window.location.pathname}${newURL}`);
        setShowContainer(false);
    }

    useClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
        closeContainer();
    });

    useEffect(() => {
        if (itemId || isNewProject) setShowContainer(true);
    }, [isNewProject, itemId]);

    if (showContainer) {
        return (
            <article
                ref={containerRef}
                className={styles.container}
            >
                {itemId && <DetailView itemId={itemId} />}
                {isNewProject && <FormNewItem groupId={groupId as string} closeContainer={closeContainer} />}
            </article>
        );
    }
}
