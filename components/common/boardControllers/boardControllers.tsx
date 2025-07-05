"use client";
import styles from "./boardControllers.module.css";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";
import { Button } from "primereact/button";
import { useBoardDataStore } from "@/stores/boardDataStore";
import { GroupData } from "@/utils/types/views";
import { addNewGroup } from "./actions";

type Props = {
  boardId: string;
};

export function BoardControllers({ boardId }: Props) {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const { groups, addGroup } = useBoardDataStore();
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupColor, setNewGroupColor] = useState<string>("");
  const { viewId } = useParams() as { viewId: string };

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
        {/* 
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setExpandedGroups(!expandedGroups)}
        >
          <i
            className={`pi pi-${
              !expandedGroups
                ? "arrow-down-left-and-arrow-up-right-to-center"
                : "arrow-up-right-and-arrow-down-left-from-center"
            } ${styles.btnIcon}`}
          ></i>
          <p>{!expandedGroups ? "Colapsar" : "Expandir"} grupos</p>
        </button> */}

        <a
          href={`/board/${boardId}/view/${viewId}/api`}
          className={styles.actionBtn}
        >
          <i className={`pi pi-file-export ${styles.btnIcon}`}></i>
          <p>Exportar tablero</p>
        </a>
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
    </article>
  );
}
