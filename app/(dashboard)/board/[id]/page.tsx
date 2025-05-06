import { verifySession } from '@/utils/dal';
import { getWorkspaceAndBoardData } from "@/actions/boards";
import { ROLES } from '@/utils/roleDefinition';
import { redirect } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
    const { id: boardId } = await params;
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
