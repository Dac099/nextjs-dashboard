'use client'

import type { BoardData, Group, StatusByColumn } from "@/utils/types/groups";
import { BoardControllers } from "@/components/common/boardControllers/boardControllers";
import { GroupItem } from "@/components/common/groupItem/groupItem";
import type { Actions } from "@/utils/types/roles";
import { useRoleUserActions } from "@/stores/roleUserActions";
import { useBoardStore } from "@/stores/boardStore";
import { useEffect } from 'react';

type GroupsViewProps = {
  boardId: string;
  columns: BoardData['columns'];
  groups: Group[];
  itemsByGroup: BoardData['itemsByGroup'];
  valuesByItem: BoardData['valuesByItem'];
  userActions: Actions[];
  boardStatus: StatusByColumn;
}

const GroupsView = ({
  boardId,
  columns,
  groups,
  itemsByGroup,
  valuesByItem,
  userActions,
  boardStatus,
}: GroupsViewProps) => {
  const arrayColumns = Array.from(columns.values());
  const setUserActions = useRoleUserActions((state) => state.setUserActions);
  const setBoardStatus = useBoardStore((state) => state.setBoardStatus);


  useEffect(() => {
    setUserActions(userActions);
    setBoardStatus(boardStatus);
  }, [boardStatus, setBoardStatus, setUserActions, userActions]);

  return (
    <>
      <BoardControllers
        boardId={boardId}
        columns={columns}
        groupsCount={groups.length}
      />

      {groups.length > 0 &&
        groups.map((group) => (
          <GroupItem
            key={group.id}
            group={group}
            columns={arrayColumns}
            items={itemsByGroup.get(group.id)!}
            values={valuesByItem}
          />
        ))}
    </>
  );
};

export default GroupsView; 
