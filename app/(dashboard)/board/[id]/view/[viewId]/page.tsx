import { BoardData } from "@/utils/types/groups";
import styles from "./styles.module.css";
import { GetBoardData } from "@/actions/groups";
import GroupsView from "@/app/components/common/groupsView/groupsView";
import { GanttContainer } from "@/components/common/ganttContainer/ganttContainer";
import { getViewType, getWorkspaceAndBoardData } from "@/actions/boards";
import { getGanttChartData } from "@/actions/gantt";
import { redirect } from 'next/navigation';
import { verifySession } from '@/utils/dal';
import { ROLES } from '@/utils/roleDefinition';

type Props = {
  params: Promise<{ id: string; viewId: string }>;
};

export default async function Page({ params }: Props) {
  const { id: boardId, viewId } = await params;
  const { workspaceName, boardName } = await getWorkspaceAndBoardData(boardId);
  const { role } = await verifySession();
  const userWorkspace = ROLES[role].permissions.find(permission => permission.workspace === workspaceName);

  if (
    !userWorkspace ||
    !userWorkspace.boards.includes(boardName) &&
    !userWorkspace.boards.includes('*')
  ) {
    redirect('/');
  }

  const boardData: BoardData = await GetBoardData(boardId);
  const arrayGroups = Array.from(boardData.groups.values());
  const viewType: string = await getViewType(viewId);
  const gantData = await getGanttChartData(boardId);
  const allowedUserActions = userWorkspace.actions;

  return (
    <article className={styles.container}>
      {viewType === "groups" && (
        <GroupsView
          boardId={boardId}
          columns={boardData.columns}
          groups={arrayGroups}
          itemsByGroup={boardData.itemsByGroup}
          valuesByItem={boardData.valuesByItem}
          userActions={allowedUserActions}
          boardStatus={boardData.statusBoard}
        />
      )}
      {viewType === "gantt" && <GanttContainer boardData={gantData} />}
    </article>
  );
}
