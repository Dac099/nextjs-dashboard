import { getRoleAccess } from "@/utils/userAccess";
import { getWorkspaceAndBoardData } from "@/actions/boards";
import { redirect } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: Props)
{
    const { id: boardId } = await params;
    const { workspaceName, boardName } = await getWorkspaceAndBoardData(boardId);
    const userRole = await getRoleAccess();
    const userWorkspace = userRole.permissions.findIndex(permission => permission.workspace === workspaceName);

    if(
        userWorkspace < 0 ||
        !userRole.permissions[userWorkspace].boards.includes(boardName) &&
        userRole.permissions[userWorkspace].boards[0] !== '*'
    ){
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
            <p>¿Con qué vista vas a trabajar?</p>
        </article>
    );
}