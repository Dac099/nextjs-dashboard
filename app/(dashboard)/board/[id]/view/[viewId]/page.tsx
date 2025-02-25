import { BoardData } from '@/utils/types/groups';
import styles from './styles.module.css';
import { GetBoardData } from '@/actions/groups';
import { AddGroupSection } from '@/components/common/addGroupSection/addGroupSection';
import { GroupItem } from '@/components/common/groupItem/groupItem';
import { getViewType } from '@/actions/boards';
import { GanttContainer } from '@/components/common/ganttContainer/ganttContainer';

type Props = {
    params: Promise<{ id: string, viewId: string }>
};

export default async function Page({ params }: Props)
{
    const { id:boardId, viewId }  = await params;
    const boardData: BoardData = await GetBoardData(boardId);
    const arrayGroups = Array.from(boardData.groups.values());
    const arrayColumns = Array.from(boardData.columns.values());
    const viewType: string = await getViewType(viewId);

    return (
        <article className={styles.container}>
            {viewType === 'groups' &&
                <>
                    <AddGroupSection 
                        boardId={boardId} 
                        columns={boardData.columns} 
                        groupsCount={arrayGroups.length}
                    />
                    {
                        arrayGroups.length > 0 &&
                            arrayGroups.map(group => (
                                <GroupItem 
                                    key={group.id} 
                                    group={group} 
                                    columns={arrayColumns}
                                    items={boardData.itemsByGroup.get(group.id)!}
                                    values={boardData.valuesByItem}
                                />
                            ))                
                    }
                </>
            }
            {viewType === 'gantt' &&
                <GanttContainer boardData={boardData}/>
            }
        </article>
    );
}