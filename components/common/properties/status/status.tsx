"use client";

import styles from "./styles.module.css";
import { TableValue } from "@/utils/types/groups";
import { useState, useRef, RefObject, MouseEvent } from "react";
import { setTableValue, addStatusColumn } from "@/actions/groups";
import { HexColorPicker } from "react-colorful";
import { FaAngleDown } from "react-icons/fa";
import useClickOutside from "@/hooks/useClickOutside";
import { useParams } from "next/navigation";
import { useBoardStore } from "@/stores/boardStore";
import { useRoleUserActions } from '@/stores/roleUserActions';
import { useItemStore } from '@/stores/useItemStore';
import { findParentKeyBySubItemId } from '@/utils/helpers';
import { TagEditor } from '../tagEditor/tagEditor';
import TagListItem from './TagListItem';

type Props = {
  value: TableValue;
  itemId: string;
  columnId: string;
};

type Tag = {
  color: string;
  text: string;
  id: string;
};

export function Status({ value, itemId, columnId }: Props) {
  const userActions = useRoleUserActions((state) => state.userActions);
  const boardStatus = useBoardStore((state) => state.boardStatus);
  const addBoardStatus = useBoardStore((state) => state.addStatus);
  const statusList: Tag[] = boardStatus?.get(columnId)?.map((item) => ({
    id: item.id,
    ...JSON.parse(item.value),
  })) || [];
  const [defaultValue, setDefaultValue] = useState<Tag>(() =>
    value.value
      ? { ...JSON.parse(value.value), id: value.id }
      : { color: "rgba(0,0,0,0.4)", text: "Sin confirmar", id: "" }
  );

  const { id: boardId, viewId } = useParams();
  const containerListRef = useRef<HTMLDivElement | null>(null);
  const [showStatusList, setShowStatusList] = useState<boolean>(false);
  const [showInputTag, setShowInputTag] = useState<boolean>(false);
  const [newInputName, setNewInputName] = useState<string>("");
  const [newInputColor, setNewInputColor] = useState<string>("");
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);

  useClickOutside(containerListRef as RefObject<HTMLDivElement>, () => {
    setShowStatusList(false);
    setShowInputTag(false);
  });

  const setTag = (tag: Tag) => {
    setTagToEdit(tag);
  }

  const openEditor = () => {
    setShowEditor(true);
  }

  const handleShowStatusList = (e: MouseEvent<HTMLElement>) => {
    if (!userActions.includes('update') || !userActions.includes('create')) return;

    const target = e.target as HTMLElement;
    if (target.classList.contains(styles.container)) {
      setShowStatusList(!showStatusList);
    }
  };

  const handleAddStatus = async () => {
    if (newInputName.length > 0) {
      const valueId: string = await addStatusColumn(
        columnId,
        JSON.stringify({
          color: newInputColor,
          text: newInputName,
        }),
        boardId as string,
        viewId as string
      );

      addBoardStatus({
        columnId: columnId,
        id: valueId,
        value: JSON.stringify({
          color: newInputColor,
          text: newInputName,
        }),
      })
      setShowInputTag(false);
    }
  }

  const handleSetValue = async (item: Tag) => {
    setShowStatusList(false);
    setDefaultValue(item);

    const valueString = JSON.stringify({
      color: item.color,
      text: item.text
    })

    const wasCreated = await setTableValue(
      boardId as string,
      viewId as string,
      itemId,
      columnId,
      valueString
    );

    const itemStore = useItemStore.getState();
    const parentKey = findParentKeyBySubItemId(itemStore.subItemsMap, itemId);

    if (parentKey) {
      if (!wasCreated) {
        itemStore.updateSubItemValue(parentKey, itemId, columnId, valueString);
        return;
      }

      itemStore.addSubItemValue(parentKey, itemId, {
        id: item.id,
        itemId: itemId,
        groupId: '',
        value: valueString,
        columnId: columnId
      })
    }
  }

  return (
    <article
      className={styles.container}
      style={{ backgroundColor: defaultValue.color }}
      onClick={handleShowStatusList}
    >
      {defaultValue.text}
      <span className={styles.corner}></span>

      {showStatusList && (
        <section className={styles.listPreview} ref={containerListRef}>

          {/* Render button to active input */}
          <p
            className={styles.showInput}
            onClick={() => setShowInputTag(!showInputTag)}
          >
            <FaAngleDown size={10} />
          </p>

          {/* Render input to add Tag */}
          {showInputTag && (
            <>
              <section className={styles.newInput}>
                <input
                  type="text"
                  onChange={(e) => setNewInputName(e.target.value)}
                  placeholder={"Nombre de Tag"}
                />
                <button onClick={handleAddStatus}>+</button>
              </section>
              <section className={styles.colorPicker}>
                <HexColorPicker onChange={setNewInputColor} />
              </section>
            </>
          )}

          {/* Render the status list */}
          {!showInputTag && !showEditor && (
            <section className={styles.tagsContainer}>
              {statusList.map((item) => (
                <TagListItem
                  item={item}
                  handleSetValue={handleSetValue}
                  key={item.id}
                  setTag={setTag}
                  openEditor={openEditor}
                />
              ))}
            </section>
          )}

          {/* Render container to edit tags */}
          {!showInputTag && showEditor && tagToEdit && (
            <TagEditor
              tag={tagToEdit}
              onClose={() => setShowEditor(false)}
              columnId={columnId}
            />
          )}
        </section>
      )}
    </article>
  );
}
