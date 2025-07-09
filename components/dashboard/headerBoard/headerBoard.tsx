'use client';
import styles from './styles.module.css';
import { ViewWithSettings, ViewDB } from "@/utils/types/views";
import { Actions } from '@/utils/types/roles';
import Link from 'next/link';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FormEvent, useRef, useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { SelectButton } from 'primereact/selectbutton';
import { createNewView, deleteView } from './actions';
import { ContextMenu } from 'primereact/contextmenu';
import { useRoleUserActions } from '@/stores/roleUserActions';

type Props = {
    views: ViewWithSettings[];
    boardId: string;
    userActions: Actions[];
};

export function HeaderBoard({ views, boardId, userActions }: Props) {
    const panelRef = useRef<OverlayPanel>(null);
    const { setUserActions } = useRoleUserActions();
    const contextRef = useRef<ContextMenu>(null);
    const viewOptions: string[] = ['Grupos', 'Gantt'];
    const [ viewTypeForm, setViewTypeForm ] = useState<string>(viewOptions[0]);
    const [ viewsList, setViewsList ] = useState<ViewWithSettings[]>(views);
    const [ viewDelete, setViewDelete ] = useState<ViewDB | null>(null);

    useEffect(() => {
        setUserActions(userActions);
    }, [userActions, setUserActions]);

    const handleCreateView = async(e: FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData(e.currentTarget as HTMLFormElement);
            const newView = await createNewView(boardId, data.get('viewName') as string, viewTypeForm);
            setViewsList((prev) => [...prev, newView]);
            panelRef.current?.hide();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteView = async() => {
        if(!viewDelete) return;
        const viewId = viewDelete.id;
        try {            
            await deleteView(viewId);
            setViewsList((prev) => prev.filter(({view}) => view.id !== viewId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className={styles.headerContainer}>

            <section className={styles.views}>
                <Button 
                    icon="pi pi-plus"
                    onClick={(e) => panelRef.current?.toggle(e)}
                    className={styles.addViewButton}
                    disabled={!userActions.includes('create')}
                />
                {viewsList.map(({view}) => (
                    <Link 
                        key={view.id}
                        href={`/board/${boardId}/view/${view.id}`}
                        className={styles.viewLink}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setViewDelete(view);
                            contextRef.current?.show(e);
                        }}
                    >
                        {view.name}
                    </Link>
                ))}
            </section>

            <OverlayPanel ref={panelRef}>
                <section>
                    <form className={styles.createViewForm} onSubmit={handleCreateView}>
                        <FloatLabel>
                            <InputText 
                                id='viewName'
                                name='viewName'
                                className={styles.viewNameInput}
                                required
                                autoComplete='off'
                            />
                            <label 
                                htmlFor="viewName"
                                className={styles.viewNameLabel}
                            >
                                Nombre de la vista
                            </label>
                        </FloatLabel>

                        <section className={styles.viewTypeSelect}>
                            <SelectButton                                 
                                options={viewOptions}
                                value={viewTypeForm}
                                onChange={(e) => setViewTypeForm(e.value)}
                                allowEmpty={false}
                                name='viewType'                            
                            />
                        </section>

                        <Button
                            label='Crear vista'
                            icon="pi pi-plus"
                            className={styles.createViewButton}
                            type='submit'
                        />
                    </form>
                </section>
            </OverlayPanel>

            <ContextMenu 
                ref={contextRef}
                model={[
                    { label: 'Eliminar vista', icon: 'pi pi-trash', command: () => handleDeleteView()},
                ]}
            />
        </section>
    );
}
