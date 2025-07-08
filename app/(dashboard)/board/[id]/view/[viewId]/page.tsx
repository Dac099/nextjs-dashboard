import styles from "./styles.module.css";
import { validateBoardAccess } from "@/utils/validateBoardAccess";
import { UserActionsProvider } from "@/components/dashboard/userActionsProvider/userActionsProvider";
import { Suspense } from 'react';
import { GroupsView } from '@/components/projects/viewsContent/groupsView/groupsView';
import { getBoardData, getBoardColumns } from '@/actions/boards';
import { fetchBoardValues } from  '@/actions/groups'
import { BoardControllers } from '@/components/common/boardControllers/boardControllers';
import { CommonLoader } from '@/components/common/commonLoader/commonLoader';
import { GanttView } from '@/components/projects/viewsContent/ganttView/gantView';

type Props = {
  params: Promise<{ id: string; viewId: string }>;
};

export default async function Page({ params }: Props) {
  const { id: boardId, viewId } = await params;
  const { allowedUserActions, viewType } = await validateBoardAccess(boardId, viewId);
  const boardDataPromise = getBoardData(boardId);
  const boardColumnsPromise = getBoardColumns(boardId);
  const boardValuesPromise = fetchBoardValues(boardId);

  return (
    <article className={styles.container}>
      <UserActionsProvider allowedUserActions={allowedUserActions} />
      <section className={styles.contentView} data-view-type={viewType}>      

        {viewType === 'groups' && 
          <Suspense fallback={<CommonLoader />}>
            <BoardControllers boardId={boardId} />
            <GroupsView 
              boardDataPromise={boardDataPromise} 
              boardColumnsPromise={boardColumnsPromise} 
              boardValuesPromise={boardValuesPromise}
            />
          </Suspense>
        }

        {viewType === 'gantt' &&
         <Suspense fallback={<CommonLoader />}>
           <GanttView />
         </Suspense>
        }
      </section>
    </article>
  );
}
