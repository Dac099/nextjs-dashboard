import { BoardData } from "@/utils/types/groups";
import styles from "./styles.module.css";
import { GetBoardData } from "@/actions/groups";
import GroupsView from "@/app/components/common/groupsView/groupsView";
import { GanttContainer } from "@/components/common/ganttContainer/ganttContainer";
import { getViewType, getWorkspaceAndBoardData } from "@/actions/boards";
import { getGanttChartData } from "@/actions/gantt";
import { getRoleAccess } from '@/utils/userAccess';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string; viewId: string }>;
};

export default async function Page({ params }: Props) {
  const { id: boardId, viewId } = await params;
  const { workspaceName, boardName } = await getWorkspaceAndBoardData(boardId);
  const userRole = await getRoleAccess();
  const userWorkspace = userRole.permissions.findIndex(permission => permission.workspace === workspaceName);

  if (
    userWorkspace < 0 ||
    !userRole.permissions[userWorkspace].boards.includes(boardName) &&
    userRole.permissions[userWorkspace].boards[0] !== '*'
  ) {
    redirect('/');
  }

  const boardData: BoardData = await GetBoardData(boardId);
  const arrayGroups = Array.from(boardData.groups.values());
  const viewType: string = await getViewType(viewId);
  const gantData = await getGanttChartData(boardId);
  const allowedUserActions = userRole.permissions[userWorkspace].actions;

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
