'use client';
import css from './groupsView.module.css';
// import { useRoleUserActions } from '@/stores/roleUserActions';
import { use, useEffect } from 'react';
import type { ColumnData, GroupData } from '@/utils/types/views';
import { GroupContainer } from './groupContainer/groupContainer';

type Props = {
  boardDataPromise: Promise<GroupData[]>;
  boardColumnsPromise: Promise<ColumnData[]>;
};

export function GroupsView({ boardDataPromise, boardColumnsPromise }: Props) {
  // const userActions = useRoleUserActions(state => state.userActions);
  const boardData = use(boardDataPromise);
  const boardColumns = use(boardColumnsPromise);

  useEffect(() => {
    const tables = document.getElementsByTagName('table');
    
    const createResizerElement = (tableHeight: number) => {
      const resizerElement = document.createElement('div');
      resizerElement.style.top = '0';
      resizerElement.style.right = '0';
      resizerElement.style.width = '5px';      
      resizerElement.style.position = 'absolute';
      resizerElement.style.cursor = 'col-resize';
      resizerElement.style.backgroundColor = 'red'
      resizerElement.style.userSelect = 'none';
      resizerElement.style.height = `${tableHeight}px`;
      return resizerElement;
    }

    const resizableGrid = (table: HTMLTableElement) => {
      const firstRow = table.getElementsByTagName('tr')[0];
      const cells = firstRow.getElementsByTagName('th');
      
      if(!cells) return;

      for(const column of cells){
        const resizerElement = createResizerElement(table.offsetHeight);
        column.appendChild(resizerElement);
        column.style.position = 'relative';
      }
    }

    for(const table of tables) {
      resizableGrid(table);
    }
    
  }, []);

  return (
    <section className={css.mainContainer}>
      {boardData.map((group) => (
        <GroupContainer key={group.id} groupData={group} boardColumns={boardColumns} />
      ))}
    </section>
  );
}