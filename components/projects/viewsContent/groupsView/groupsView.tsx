"use client";
import css from "./groupsView.module.css";
import { use, useEffect, useState } from "react";
import type {
  ColumnData,
  GroupData,
  ItemData as RowData,
} from "@/utils/types/views"; // Renombrar ItemData a RowData para consistencia
import { GroupContainer } from "./groupContainer/groupContainer";
import { useResizableColumns } from "@/hooks/useResizableColumns";
import { GroupContainerWrapper } from "./groupContainer/groupContainerWrapper";
import { SortableDraggableRow } from "./sortableDraggableRow/sortableDraggableRow"; // Asegúrate de tener este import
import { dropItemInGroup, orderElements } from "./actions";
import { useBoardDataStore } from '@/stores/boardDataStore';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";
import { CustomError } from "@/utils/customError";

type Props = {
  boardDataPromise: Promise<GroupData[]>;
  boardColumnsPromise: Promise<ColumnData[]>;
};

export function GroupsView({ boardDataPromise, boardColumnsPromise }: Props) {
  const {
    groups,
    columns,
    setGroups,
    setColumns
  } = useBoardDataStore(state => state);
  
  const initialGroups = use(boardDataPromise);
  const initialColumns = use(boardColumnsPromise);

  useEffect(() => {
    setGroups(initialGroups);
    setColumns(initialColumns);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });

  useResizableColumns();

  const findGroup = (id: string): GroupData | undefined =>
    groups.find((group) => group.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type; // Puede ser 'group' o 'column' o 'row'

    // Lógica para reordenar TABLAS (Groups)
    if (activeType === "group" && overType === "group") {
      const oldIndex = groups.findIndex((group) => group.id === active.id);
      const newIndex = groups.findIndex((group) => group.id === over.id);

      if (oldIndex !== newIndex) {
        const updatedGroups = arrayMove(groups, oldIndex, newIndex);
        setGroups(updatedGroups);
        orderElements(over.id as string, active.id as string, "Groups").catch(
          (error: CustomError) => {
            console.log(error.message);
          }
        );
      }
    }
    // Lógica para reordenar COLUMNAS
    else if (activeType === "column" && overType === "column") {
      const oldIndex = columns.findIndex(
        (column) => column.id === active.id
      );
      const newIndex = columns.findIndex(
        (column) => column.id === over.id
      );

      if (oldIndex !== newIndex) {
        const updatedColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(updatedColumns);
        orderElements(over.id as string, active.id as string, "Columns").catch(
          (error: CustomError) => {
            console.log(error.message);
          }
        );
      }
    }
    // Lógica para reordenar FILAS O MOVER FILAS ENTRE GRUPOS
    else if (activeType === "row" && (overType === "row" || overType === "group")) {
      const activeRowParentId = active.data.current?.parentGroupId as string; // Asegurarse de que sea string
      const overContainerId = over.id as string; // El ID del elemento sobre el que se soltó (puede ser una fila o un grupo)

      const activeGroup = findGroup(activeRowParentId);
      const activeRow = active.data.current?.rowData as RowData; // Acceder a los datos completos de la fila activa

      if (!activeGroup || !activeRow) {
        setActiveId(null);
        return;
      }

      // Si se soltó sobre un DROPPABLE de grupo (GroupContainerWrapper es droppable)
      const overIsGroup = groups.some(
        (group) => group.id === overContainerId
      );

      const newBoardData = [...groups]; // Crear una copia mutable para la manipulación

      // 1. Eliminar la fila del grupo de origen
      const sourceGroupIndex = newBoardData.findIndex(
        (g) => g.id === activeGroup.id
      );
      if (sourceGroupIndex !== -1) {
        newBoardData[sourceGroupIndex].items = newBoardData[
          sourceGroupIndex
        ].items.filter((row) => row.id !== active.id);
      } else {
        // Esto no debería pasar si activeGroup se encontró
        setActiveId(null);
        return;
      }

      // 2. Insertar la fila en el grupo de destino
      if (overIsGroup) {
        // Se soltó sobre un GroupContainerWrapper (un grupo)
        const destinationGroupIndex = newBoardData.findIndex(
          (g) => g.id === overContainerId
        );
        if (destinationGroupIndex !== -1) {
          newBoardData[destinationGroupIndex].items.push(activeRow); // Añadir al final del grupo}
          dropItemInGroup(overContainerId, activeRow.id) // Call the action to update the database
            .catch((error: CustomError) => {
              console.log(error.message);
            });
        }
      } else {
        // Se soltó sobre otra fila
        const overRowParentId = over.data.current?.parentGroupId as string;
        const destinationGroupIndex = newBoardData.findIndex(
          (g) => g.id === overRowParentId
        );
        const overRowIndex = newBoardData[
          destinationGroupIndex
        ]?.items.findIndex((row) => row.id === over.id);

        if (destinationGroupIndex !== -1 && overRowIndex !== -1) {
          newBoardData[destinationGroupIndex].items.splice(
            overRowIndex,
            0,
            activeRow
          );

          dropItemInGroup(overRowParentId, activeRow.id)
            .then((orderOK) => {
              if(orderOK){
                return orderElements(over.id as string, activeRow.id, 'Items');
              }
            })
            .catch((error: CustomError) => {
              console.log(error.message);
            });
        } 
        
        else if (destinationGroupIndex !== -1) {
          // Caso de borde: se soltó sobre un ID que no es una fila dentro de ese grupo (e.g. el GroupContainerWrapper mismo)
          newBoardData[destinationGroupIndex].items.push(activeRow);

          dropItemInGroup(overRowParentId, activeRow.id)
            .catch((error: CustomError) => {
              console.log(error.message);
            });
        }
      }
      setGroups(newBoardData); // Actualizar el estado con la nueva configuración
    }

    setActiveId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const isDraggingColumn = activeId
    ? columns.some((column) => column.id === activeId)
    : false; // CORREGIDO

  const isDraggingGroup = activeId
    ? groups.some((group) => group.id === activeId)
    : false;

  const isDraggingRow = activeId
    ? groups.some((group) =>
        group.items.some((item) => item.id === activeId)
      )
    : false;

  const renderDragOverlayContent = () => {
    if (isDraggingGroup) {
      const activeGroup = groups.find((group) => group.id === activeId);
      if (activeGroup) {
        return (
          <div className={css.groupDragging}>
            <GroupContainer
              groupData={activeGroup}
              activeDndId={activeId}
            />
          </div>
        );
      }
    }

    if (isDraggingRow) {
      let activeRow: RowData | null = null;
      let parentGroupId: string | null = null;

      // Encuentra la fila activa y su grupo padre
      // Podrías simplificar esto si `active.data.current?.rowData` ya tiene la fila completa
      for (const group of groups) {
        const foundRow = group.items.find((row) => row.id === activeId);
        if (foundRow) {
          activeRow = foundRow;
          parentGroupId = group.id;
          break;
        }
      }

      if (activeRow && parentGroupId) {
        return (
          <table className={css.rowDragging}>
            <tbody>
              <SortableDraggableRow
                itemData={activeRow}
                id={activeRow.id}
                boardColumns={columns}
                isThisRowActive={true} // El clon siempre es visible
                parentGroupId={parentGroupId} // Pasamos el parentGroupId al clon
              />
            </tbody>
          </table>
        );
      }
    }

    return null;
  };

  const getAxisModifiersMovement = () => {
    if (isDraggingGroup) return [restrictToVerticalAxis];
    if (isDraggingColumn) return [restrictToHorizontalAxis];
    if (isDraggingRow) return [restrictToVerticalAxis]; // Las filas solo se mueven verticalmente
    return []; // Por defecto, no hay modificadores
  };

  return (
    <section className={css.mainContainer}>
      <DndContext
        sensors={[sensor]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={groups.map((group) => group.id)}
          strategy={verticalListSortingStrategy}
        >
          {groups.map((group) => (
            <GroupContainerWrapper
              key={group.id}
              groupData={group}
              id={group.id}
              isThisGroupActive={activeId === group.id}
              activeDndId={activeId}
            />
          ))}
        </SortableContext>

        <DragOverlay modifiers={getAxisModifiersMovement()}>
          {renderDragOverlayContent()}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
