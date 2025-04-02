'use client'

import { BoardData, Group } from "@/utils/types/groups";
import { AddGroupSection } from "@/components/common/addGroupSection/addGroupSection";
import { GroupItem } from "@/components/common/groupItem/groupItem";
import type { Actions } from "@/utils/types/roles";
import { useRoleUserActions } from "@/stores/roleUserActions";

type GroupsViewProps = {
  boardId: string;
  columns: BoardData['columns'];
  groups: Group[];
  itemsByGroup: BoardData['itemsByGroup'];
  valuesByItem: BoardData['valuesByItem'];
  userActions: Actions[];
}

const GroupsView = ({
  boardId,
  columns,
  groups,
  itemsByGroup,
  valuesByItem,
  userActions,
}: GroupsViewProps) => {
  const arrayColumns = Array.from(columns.values());
  const setUserActions = useRoleUserActions((state) => state.setUserActions);
  setUserActions(userActions);

  return (
    <>
      {userActions.includes('create') &&
        <AddGroupSection
          boardId={boardId}
          columns={columns}
          groupsCount={groups.length}
        />
      }
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