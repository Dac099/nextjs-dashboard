"use client";
import styles from "./boardControllers.module.css";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";
import { Button } from "primereact/button";
import { useBoardDataStore } from "@/stores/boardDataStore";
import { GroupData } from "@/utils/types/views";
import { addNewGroup, getListedUsersInProjects, getLinkedProjects } from "./actions";
import { TbUsers } from "react-icons/tb";
import { Dialog } from 'primereact/dialog';
import { linkedUserProject, UserData } from '@/utils/types/items';
import { FaClipboardUser } from "react-icons/fa6";
import { SearchBar } from './searchBar/searchBar';

type Props = {
  boardId: string;
};

export function BoardControllers({ boardId }: Props) {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { groups, addGroup } = useBoardDataStore();
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupColor, setNewGroupColor] = useState<string>("");
  const { viewId } = useParams() as { viewId: string };
  const [linkedUsersInBoard, setLinkedUsersInBoard] = useState<UserData[]>([]);
  const [usersWithProjects, setUsersWithProjects] = useState<linkedUserProject[]>([]);

  const handleAddNewGroup = async () => {
    if (newGroupColor.length < 1 || newGroupName.length < 1) return;
    const newGroupId = await addNewGroup(
      boardId,
      newGroupName,
      `#${newGroupColor}`
    );
    const newGroup: GroupData = {
      id: newGroupId,
      name: newGroupName,
      color: `#${newGroupColor}`,
      position: groups.length + 1, // Assuming position is based on the current number of groups
      items: [],
    };

    addGroup(newGroup);
    setNewGroupName("");
    setNewGroupColor("");
    overlayPanelRef.current?.hide();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const usersInBoard = await getListedUsersInProjects(boardId);
        setLinkedUsersInBoard(usersInBoard);
      }catch(error){
        console.error(error);
      }
    }

    fetchData();
  }, [boardId]);

  const handleShowUsersInBoard = async() => {
    setShowDialog(true);
    try {
      const results = await getLinkedProjects(linkedUsersInBoard);
      setUsersWithProjects(results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article className={styles.container}>
      <section className={styles.buttonsContainer}>
        <button
          type="button"
          onClick={(e) => overlayPanelRef.current?.toggle(e)}
          className={styles.actionBtn}
        >
          <i className={`pi pi-plus ${styles.btnIcon}`}></i>
          <p>Agregar grupo</p>
        </button>

        <a
          href={`/board/${boardId}/view/${viewId}/api`}
          className={styles.actionBtn}
        >
          <i className={`pi pi-file-export ${styles.btnIcon}`}></i>
          <p>Exportar tablero</p>
        </a>

        { linkedUsersInBoard.length > 0 &&         
          <button
            className={styles.actionBtn}
            onClick={() => handleShowUsersInBoard()}
          >
            <TbUsers size={18}/>
            <p>Usuarios activos</p>
          </button>
        }

        <SearchBar />
      </section>

      <OverlayPanel
        ref={overlayPanelRef}
        showCloseIcon
        onHide={() => overlayPanelRef.current?.hide()}
      >
        <InputText
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Nombre del grupo"
          style={{ fontSize: "1.2rem", width: "200px", display: "block" }}
        />

        <ColorPicker
          value={newGroupColor}
          onChange={(e: ColorPickerChangeEvent) =>
            setNewGroupColor(e.value as string)
          }
          style={{ width: "200px", margin: "1rem 0" }}
          inline
          format="hex"
          inputStyle={{ fontSize: "1.2rem" }}
        />

        <Button
          label="Agregar"
          icon="pi pi-plus"
          style={{ display: "block", width: "100%" }}
          onClick={handleAddNewGroup}
        />
      </OverlayPanel>

      <Dialog
        visible={showDialog}
        draggable={false}
        onHide={() => setShowDialog(false)}
        header={HeaderElement}
        maximizable
        className={styles.dialogContainer}
      >

        <section className={styles.usersContainer}>          
          {usersWithProjects.map(({user, projects}) => (
            <article key={user.id} className={styles.userCard}>
              
              <div className={styles.userInfo}>
                <FaClipboardUser size={25} />
                <p>{user.name} <i>({user.username})</i></p>
              </div>

              <details className={styles.userProjectsDetails}>
                <summary>Proyectos asignados</summary>
                <ol className={styles.userProjects}>
                  {projects.map((project) => (
                    <li key={project.projectId}>
                      {project.projectName}
                    </li>
                  ))}
                </ol>
              </details>
            </article>
          ))}
        </section>

      </Dialog>
    </article>
  );
}

const HeaderElement =  (
  <section className={styles.headerElement}>
    <TbUsers size={30} className={styles.headerIcon}/>
    <h2 className={styles.headerTitle}>Usuarios activos en proyectos</h2>
  </section>
);