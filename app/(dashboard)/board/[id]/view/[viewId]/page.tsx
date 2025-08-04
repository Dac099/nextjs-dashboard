import styles from "./styles.module.css";
import { validateBoardAccess } from "@/utils/validateBoardAccess";
import { UserActionsProvider } from "@/components/dashboard/userActionsProvider/userActionsProvider";
import { Suspense } from 'react';
import { GroupsView } from '@/components/projects/viewsContent/groupsView/groupsView';
import { BoardControllers } from '@/components/common/boardControllers/boardControllers';
import { CommonLoader } from '@/components/common/commonLoader/commonLoader';
import { GanttView } from '@/components/projects/viewsContent/ganttView/gantView';

type Props = {
  params: Promise<{ id: string; viewId: string }>;
};

export default async function Page({ params }: Props) {
  const { id: boardId, viewId } = await params;
  const { allowedUserActions, viewType } = await validateBoardAccess(boardId, viewId);

  return (
    <article className={styles.container}>
      <UserActionsProvider allowedUserActions={allowedUserActions} />
      <section className={styles.contentView} data-view-type={viewType}>      

        {viewType === 'groups' && 
          <>
            <BoardControllers boardId={boardId} />
            <GroupsView boardId={boardId} />
          </>

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
