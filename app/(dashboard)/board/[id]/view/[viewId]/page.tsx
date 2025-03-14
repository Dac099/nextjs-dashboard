import { BoardData } from "@/utils/types/groups";
import styles from "./styles.module.css";
import { GetBoardData } from "@/actions/groups";
import { AddGroupSection } from "@/components/common/addGroupSection/addGroupSection";
import { GroupItem } from "@/components/common/groupItem/groupItem";
import { getViewType } from "@/actions/boards";
import { GanttContainer } from "@/components/common/ganttContainer/ganttContainer";
import { getGanttChartData } from "@/actions/gantt";
import { getWorkspaceWithBoard } from '@/actions/auth';
import { getRoleAccess } from '@/utils/userAccess';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string; viewId: string }>;
};

export default async function Page({ params }: Props) {
  const { id: boardId, viewId } = await params;
  const {workspaceName, boardName} = await getWorkspaceWithBoard(boardId);
  const userRole = await getRoleAccess();
  const userWorkspace = userRole.permissions.findIndex(permission => permission.workspace === workspaceName);

  if(
    userWorkspace < 0 ||
    !userRole.permissions[userWorkspace].boards.includes(boardName) &&
    userRole.permissions[userWorkspace].boards[0] !== '*'
  ){
    redirect('/');
  }

  const boardData: BoardData = await GetBoardData(boardId);
  const arrayGroups = Array.from(boardData.groups.values());
  const arrayColumns = Array.from(boardData.columns.values());
  const viewType: string = await getViewType(viewId);
  const gantData = await getGanttChartData(boardId);

  return (
    <article className={styles.container}>
      {viewType === "groups" && (
        <>
          <AddGroupSection
            boardId={boardId}
            columns={boardData.columns}
            groupsCount={arrayGroups.length}
          />
          {arrayGroups.length > 0 &&
            arrayGroups.map((group) => (
              <GroupItem
                key={group.id}
                group={group}
                columns={arrayColumns}
                items={boardData.itemsByGroup.get(group.id)!}
                values={boardData.valuesByItem}
              />
            ))}
        </>
      )}
      {viewType === "gantt" && <GanttContainer boardData={gantData} />}
    </article>
  );
}
