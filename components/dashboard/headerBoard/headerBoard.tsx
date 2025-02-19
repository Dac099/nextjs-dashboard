'use client';

import styles from './styles.module.css';
import Link from 'next/link';
import { IoMdAdd } from "react-icons/io";
import {Tooltip} from "@/components/common/tooltip/tooltip";
import {ViewWithSettings} from "@/utils/types/views";
import {
    useState,
    useRef,
    RefObject,
    useEffect,
    KeyboardEvent
} from "react";
import {
    LuChartGantt,
    LuChartColumnBig,
    LuTable2,
} from "react-icons/lu";
import useClickOutside from "@/hooks/useClickOutside";
import {addViewBoard} from "@/actions/boards";
import { useParams} from "next/navigation";
import {FiltersBar} from "@/components/projects/filtersBar/filtersBar";

type Props = {
    views: ViewWithSettings[];
    boardId: string;
};

export function HeaderBoard({views, boardId}: Props)
{
    const params = useParams();
    const viewId: string = params.viewId as string || '';
    const viewMenuRef = useRef<HTMLDivElement>(null);
    const inputViewRef = useRef<HTMLInputElement>(null);
    const [filteredViews, setFilteredViews] = useState<ViewWithSettings[]>(views);
    const [showViewMenu, setShowViewMenu] = useState<boolean>(false);
    const [showViewInput, setShowViewInput] = useState<boolean>(false);
    const [newViewType, setNewViewType] = useState<string>('');
    const translateViewType = new Map<string, string>([
        ['groups', 'Grupo'],
        ['gantt', 'Gantt'],
        ['chart', 'Gráfico'],
    ]);

    useClickOutside(viewMenuRef as RefObject<HTMLDivElement>, () => {
        setShowViewMenu(false);
        setShowViewInput(false);
    });

    function handleShowViewInput(viewType: string): void {
        setShowViewInput(true);
        setShowViewMenu(false);
        setNewViewType(viewType);
    }

    function handleShowViewMenu() {
        setShowViewMenu(true);
        setShowViewInput(false);
    }

    async function handleSubmitView(e: KeyboardEvent<HTMLInputElement>)
    {
        if(e.code === 'Escape'){
            setShowViewInput(false);
        }

        if(e.code === 'Enter'){
            const inputValue: string = inputViewRef.current!.value;
            const updatedViews: ViewWithSettings[] = filteredViews;
            const newView: ViewWithSettings = {
                view: {
                    type: newViewType,
                    name: inputValue,
                    is_default: false,
                    id: Math.random().toString()
                },
                settings: [],
            };
            updatedViews.push(newView);
            setFilteredViews(updatedViews);
            setShowViewInput(false);
            await addViewBoard(boardId, newView);
        }
    }

    useEffect(() => {
        if(showViewInput)
        {
            const placeholderViewType: string = translateViewType.get(newViewType) || 'Elemento';
            inputViewRef.current!.focus();
            inputViewRef.current!.placeholder = `Nombre del ${placeholderViewType}`
        }
    }, [showViewInput]);

    return (
        <article className={styles.headerContainer}>
            <section className={styles.views}>
                <section>
                    {
                        filteredViews.map(({view}) =>(
                            <div
                                key={view.id}
                                className={`${styles.viewLink} ${viewId === view.id ? styles.viewLinkActive : ''}`}
                            >

                                <Link href={`/board/${boardId}/view/${view.id}`}>
                                    {view.name}
                                </Link>
                            </div>
                        ))
                    }
                    { showViewInput &&
                        <input
                            type="text"
                            ref={inputViewRef}
                            className={styles.viewInput}
                            onKeyUp={(e) => handleSubmitView(e)}
                        />
                    }
                </section>
                <section className={styles.control} ref={viewMenuRef}>
                    <Tooltip text={'Nueva vista'}>
                        <div
                            className={styles.addIcon}
                            onClick={() => handleShowViewMenu()}
                        >
                            <IoMdAdd size={20}/>
                        </div>
                    </Tooltip>
                    { showViewMenu &&
                        <section className={styles.controlMenu}>
                            <span
                                className={styles.menuOption}
                                onClick={() => handleShowViewInput('groups')}
                            >
                                <LuTable2/>
                                <p>Grupos</p>
                            </span>

                            <span
                                className={styles.menuOption}
                                onClick={() =>handleShowViewInput('gantt')}
                            >
                                <LuChartGantt/>
                                <p>Gantt</p>
                            </span>

                            <span
                                className={styles.menuOption}
                                onClick={() =>handleShowViewInput('chart')}
                            >
                                <LuChartColumnBig/>
                                <p>Gráfica</p>
                            </span>

                        </section>
                    }
                </section>
            </section>
            <section className={styles.filters}>
                <FiltersBar />
            </section>
        </article>
    );
}