import styles from "./tagColumn.module.css";
import { useBoardStore } from "@/stores/boardStore";
import { OverlayPanel } from "primereact/overlaypanel";
import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useRef, useState } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { Button } from "primereact/button";
import { StatusValue } from "@/utils/types/groups";
import { addStatusColumn } from "@/actions/groups";
import { useParams } from "next/navigation";
import { Toast } from "primereact/toast";
import { updateTagStatus, deleteTagStatus } from "@/actions/items";

type Props = {
  value?: TagData | TagData[];
  callback: (newValue: string) => void;
  columnId: string;
};

type TagData = {
  color: string;
  text: string;
};

export function TagColumn({
  callback,
  value = { color: "rgba(0,0,0,0.4)", text: "Sin definir" },
  columnId,
}: Props) {
  const { id: boardId, viewId } = useParams() as { id: string; viewId: string };
  const overlayRef = useRef<OverlayPanel>(null);
  const contextMenuRef = useRef<ContextMenu>(null);
  const toastRef = useRef<Toast>(null);
  const statusBoard = useBoardStore((state) => state.boardStatus);
  const removeTag = useBoardStore((state) => state.removeStatus);
  const updateTag = useBoardStore((state) => state.updateStatus);
  const addTag = useBoardStore((state) => state.addStatus);
  const [singleTagValue, setSingleTagValue] = useState<TagData>(
    value as TagData
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [newTagData, setNewTagData] = useState<TagData>({
    color: "#bdbdc7",
    text: "Sin definir",
  });
  const [tagSelected, setTagSelected] = useState<StatusValue | null>(null);

  useEffect(() => {
    if (tagSelected) {
      setNewTagData({
        color: JSON.parse(tagSelected.value).color,
        text: JSON.parse(tagSelected.value).text,
      });
    }
  }, [tagSelected]);

  if (Array.isArray(value)) {
    return <article></article>;
  }

  const handleEditTag = async (tag: StatusValue) => {
    updateTag(tag);

    const newTagToUpdate = {
      id: tag.id,
      color: JSON.parse(tag.value).color,
      text: JSON.parse(tag.value).text,
    };

    const previousTag = {
      id: tagSelected!.id,
      color: JSON.parse(tagSelected!.value).color,
      text: JSON.parse(tagSelected!.value).text,
    };

    await updateTagStatus(newTagToUpdate, columnId, previousTag);
  };

  const handleAddTag = async (tag: TagData) => {
    const tagId: string = await addStatusColumn(
      columnId,
      JSON.stringify(tag),
      boardId,
      viewId
    );

    const newTag: StatusValue = {
      value: JSON.stringify(tag),
      columnId,
      id: tagId,
    };

    addTag(newTag);
  };

  const handleDeleteTag = async() => {
    removeTag(tagSelected!.id, columnId);
    await deleteTagStatus(tagSelected!.id, tagSelected!.value, columnId);
  };

  const resetValues = () => {
    setNewTagData({ color: "#bdbdc7", text: "Sin definir" });
    setIsEditMode(false);
    setTagSelected(null);
  };

  const handleSuccessEditorBtn = () => {
    if (!isEditMode) {
      if (
        newTagData.text.length === 0 ||
        newTagData.color.length === 0 ||
        newTagData.color === "#bdbdc7" ||
        newTagData.text === "Sin definir"
      ) {
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Se necesita definir nombre y color",
          life: 3000,
        });
        return;
      }

      handleAddTag(newTagData);
      setActiveTabIndex(0);
      resetValues();
      return;
    }

    if (
      newTagData.text.length === 0 ||
      newTagData.color.length === 0 ||
      newTagData.color === JSON.parse(tagSelected!.value).color ||
      newTagData.text === JSON.parse(tagSelected!.value).text
    ) {
      toastRef.current?.show({
        severity: "info",
        summary: "Error",
        detail: "Se necesita definir nombre y color",
        life: 3000,
      });
      return;
    }

    handleEditTag({
      ...tagSelected!,
      value: JSON.stringify(newTagData),
    });
    resetValues();
    setActiveTabIndex(0);
  };

  return (
    <article
      className={styles.tagContainer}
      style={{ backgroundColor: singleTagValue.color }}
    >
      <p
        className={styles.tagContainerText}
        onClick={(e) => overlayRef.current?.toggle(e)}
      >
        {singleTagValue.text}
      </p>
      <OverlayPanel ref={overlayRef}>
        <section>
          <TabView
            activeIndex={activeTabIndex}
            onTabChange={(e) => {
              setActiveTabIndex(e.index);
              if (e.index === 0) {
                resetValues();
              }
            }}
          >
            <TabPanel header="Etiquetas">
              <section className={styles.tagListContainer}>
                {statusBoard.get(columnId)?.map((tag) => (
                  <p
                    key={tag.id}
                    style={{ backgroundColor: JSON.parse(tag.value).color }}
                    onClick={() => {
                      callback(tag.value);
                      setSingleTagValue(JSON.parse(tag.value));
                      overlayRef.current?.hide();
                    }}
                    onContextMenu={(e) => {
                      contextMenuRef.current?.show(e);
                      setTagSelected(tag);
                    }}
                  >
                    {JSON.parse(tag.value).text}
                  </p>
                ))}
              </section>
            </TabPanel>

            <TabPanel
              header={isEditMode ? "Editar etiqueta" : "Crear etiqueta"}
            >
              <section className={styles.generatorField}>
                <FloatLabel>
                  <label
                    htmlFor="tagName"
                    style={{ color: "var(--action-color)", fontWeight: "bold" }}
                  >
                    Nombre de la etiqueta
                  </label>
                  <InputText
                    id="tagName"
                    value={newTagData?.text}
                    onChange={(e) => {
                      setNewTagData({
                        ...newTagData,
                        text: e.target.value,
                      });
                    }}
                    style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}
                  />
                </FloatLabel>
              </section>

              <section className={styles.generatorField}>
                <ColorPicker
                  inline
                  value={newTagData?.color}
                  format="hex"
                  onChange={(e) => {
                    setNewTagData({
                      ...newTagData,
                      color: `#${e.value?.toString() || "bdbdc7"}`,
                    });
                  }}
                />
              </section>

              <section className={styles.actionsContainer}>
                <Button
                  label="Cancelar"
                  severity="danger"
                  icon="pi pi-times"
                  onClick={() => {
                    resetValues();
                    setActiveTabIndex(0);
                  }}
                />

                <Button
                  label={isEditMode ? "Actualizar" : "Crear"}
                  icon="pi pi-plus"
                  onClick={handleSuccessEditorBtn}
                />
              </section>
            </TabPanel>
          </TabView>
        </section>
      </OverlayPanel>
      <ContextMenu
        ref={contextMenuRef}
        model={[
          {
            label: "Eliminar etiqueta",
            icon: "pi pi-fw pi-trash",
            command: handleDeleteTag,
          },
          {
            label: "Editar etiqueta",
            icon: "pi pi-fw pi-pencil",
            command: () => {
              setIsEditMode(true);
              setActiveTabIndex(1);
            },
          },
        ]}
      />
      <Toast ref={toastRef} />
    </article>
  );
}
