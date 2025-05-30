'use client';
import css from './groupsView.module.css';
import { useRoleUserActions } from '@/stores/roleUserActions';
import { use } from 'react';
import type { ColumnData, GroupData } from '@/utils/types/views';
import { GroupContainer } from './groupContainer/groupContainer';

type Props = {
  boardDataPromise: Promise<GroupData[]>;
  boardColumnsPromise: Promise<ColumnData[]>;
};

export function GroupsView({ boardDataPromise, boardColumnsPromise }: Props) {
  const userActions = useRoleUserActions(state => state.userActions);
  const boardData = use(boardDataPromise);
  const boardColumns = use(boardColumnsPromise);

  return (
    <section className={css.mainContainer}>
      {boardData.map((group) => (
        <GroupContainer key={group.id} groupData={group} boardColumns={boardColumns} />
      ))}
    </section>
  );
}