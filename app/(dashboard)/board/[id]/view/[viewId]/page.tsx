import styles from "./styles.module.css";
import { validateBoardAccess } from "@/utils/validateBoardAccess";
import { UserActionsProvider } from "@/components/dashboard/userActionsProvider/userActionsProvider";
import { Suspense } from 'react';
import { GroupsSkeleton } from './groupsSkeleton';
import { GroupsView } from '@/components/projects/viewsContent/groupsView/groupsView';
import { getBoardData, getBoardColumns } from '@/actions/boards';

type Props = {
  params: Promise<{ id: string; viewId: string }>;
};

export default async function Page({ params }: Props) {
  const { id: boardId, viewId } = await params;
  const { allowedUserActions, viewType } = await validateBoardAccess(boardId, viewId);
  const boardDataPromise = getBoardData(boardId);
  const boardColumnsPromise = getBoardColumns(boardId);

  return (
    <article className={styles.container}>
      <UserActionsProvider allowedUserActions={allowedUserActions} />
      
      <section className={styles.contentView} data-view-type={viewType}>
        <Suspense fallback={<GroupsSkeleton />}>
          <GroupsView boardDataPromise={boardDataPromise} boardColumnsPromise={boardColumnsPromise} />
        </Suspense>
      </section>
    </article>
  );
}
