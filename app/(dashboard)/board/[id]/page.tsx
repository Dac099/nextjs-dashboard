import { verifySession } from '@/utils/dal';
import { getWorkspaceAndBoardData, getBoardViews } from "@/actions/boards";
import { ROLES } from '@/utils/roleDefinition';
import { redirect } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
    const { id: boardId } = await params;
    const [viewsBoard, result, roleResult] = await Promise.all([
        getBoardViews(boardId), 
        getWorkspaceAndBoardData(boardId),
        verifySession()
    ]);

    if(viewsBoard && viewsBoard.length > 0 && viewsBoard[0].view.name) {
        redirect(`/board/${boardId}/view/${viewsBoard[0].view.id}`);
    }

    if(!result || result.length === 0) {
        redirect('/not-found');
    }

    const { workspaceName, boardName } = result;
    const { role } = roleResult;
    const userWorkspace = ROLES[role].permissions.find(permission => permission.workspace === workspaceName);

    if (
        !userWorkspace ||
        !userWorkspace.boards.includes(boardName) &&
        !userWorkspace.boards.includes('*')
    ) {
        redirect('/');
    }

    return (
        <article
            style={{
                textAlign: 'center',
                fontSize: '2rem',
                color: 'var(--action-color)',
                fontWeight: 'bold'
            }}
        >
            <p>Empieza agregando un una nueva vista al tablero</p>
        </article>
    );
}
