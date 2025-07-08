'use server';
import { ViewWithSettings, GroupData, ColumnData } from "@/utils/types/views";
import connection from '@/services/database';
import { redirect } from "next/navigation";
import { CustomError } from '@/utils/customError';

type ViewsDB = {
    id: string;
    name: string;
    type: string;
    is_default: boolean;
    viewSettingId: string;
    setting_key: string;
    setting_value: string;
};

type ReduceAcc = {
    [key: string]: ViewWithSettings;
};
export async function getBoardViews(boardId: string): Promise<ViewWithSettings[]> {
    await connection.connect();
    const query: string = `
        SELECT
            v.id,
            v.name,
            v.type,
            v.is_default,
            vs.id as viewSettingId,
            vs.setting_key,
            vs.setting_value
        FROM Views v
        LEFT JOIN ViewSettings vs ON vs.view_id = v.id
        WHERE v.board_id = @boardId
            AND v.deleted_at IS NULL
            AND vs.deleted_at IS NULL
        ORDER BY v.position ASC
    `;
    const result = await connection
        .request()
        .input('boardId', boardId)
        .query(query);

    const resultByView: ReduceAcc = result.recordset.reduce((acc: ReduceAcc, curr: ViewsDB) => {
        if (!acc[curr.id]) {
            acc[curr.id] = {
                view: {
                    type: '',
                    name: '',
                    is_default: false,
                    id: ''
                },
                settings: []
            };
        }

        acc[curr.id].view = {
            id: curr.id,
            is_default: curr.is_default,
            name: curr.name,
            type: curr.type
        };

        acc[curr.id].settings.push({
            id: curr.viewSettingId,
            setting_key: curr.setting_key,
            setting_value: curr.setting_value
        });

        return acc;
    }, {});
    return Object.values(resultByView);
}

export async function addViewBoard(boardId: string, view: ViewWithSettings): Promise<void> {
    const { type, name, is_default } = view.view;
    await connection.connect();
    const viewQuery: string = `
        INSERT INTO Views (board_id, name, type, is_default, position)
        OUTPUT inserted.id
        VALUES (@board_id, @name, @type, @is_default, 0)
    `;
    const settingsQuery: string = `
        INSERT INTO ViewSettings (view_id, setting_key, setting_value)
        VALUES (@view_id, @setting_key, @setting_value)
    `;

    const result = await connection
        .request()
        .input('board_id', boardId)
        .input('name', name)
        .input('type', type)
        .input('is_default', is_default)
        .query(viewQuery);

    const viewId = result.recordset[0].id;

    await connection
        .request()
        .input('view_id', viewId)
        .input('setting_key', '')
        .input('setting_value', '')
        .query(settingsQuery);

    redirect(`/board/${boardId}/view/${viewId}`);
}

export async function getViewType(viewId: string): Promise<string> {
    await connection.connect()
    const query: string = `
        SELECT type
        FROM Views
        WHERE id = @viewId
    `;

    const result = await connection
        .request()
        .input('viewId', viewId)
        .query(query);

    return result.recordset[0]?.type;
}

export async function getWorkspaceAndBoardData(boardId: string) {
    try {
        await connection.connect();
        const query: string = `
        SELECT
          w.id AS workspaceId,
          w.name AS workspaceName,
          b.id AS boardId,
          b.name AS boardName
        FROM Boards b
        LEFT JOIN Workspaces w ON b.workspace_id = w.id
        WHERE b.id = @boardId AND b.deleted_at IS NULL
      `;

        const result = await connection
            .request()
            .input('boardId', boardId)
            .query(query);

        return result.recordset[0];
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al obtener la información del tablero', error.message);
        }

        console.log('Error al obtener la información del tablero', error);
        redirect('/');
    }
}

export async function getBoardData(boardId: string): Promise<GroupData[]> {
    try {
        await connection.connect();

        // Delay artificial de 3 segundos para testing del skeleton
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result: GroupData[] = [];

        const valuesQuery: string = `
            SELECT
                tb.id,
                tb.item_id as itemId,
                tb.column_id as columnId, 
                tb.value
            FROM TableValues tb
            LEFT JOIN Items i ON tb.item_id = i.id
            LEFT JOIN Groups g ON i.group_id = g.id
            WHERE g.board_id = @boardId 
                AND g.deleted_at IS NULL
                AND i.deleted_at IS NULL
                AND tb.deleted_at IS NULL
        `;

        const itemsQuery: string = `
            SELECT 
                i.id,
                i.group_id as groupId,
                i.project_id as projectId,
                i.name,
                i.position
            FROM Items i
            LEFT JOIN Groups g ON i.group_id = g.id
            WHERE g.board_id = @boardId 
                AND i.deleted_at IS NULL
            ORDER BY i.position, g.position
        `;

        const groupsQuery: string = `
            SELECT 
                g.id,
                g.name,
                g.position,
                g.color
            FROM Groups g
            LEFT JOIN Boards b ON g.board_id = b.id
            WHERE b.id = @boardId 
                AND g.deleted_at IS NULL
            ORDER BY g.position
        `;

        const valuesPromise = connection.request().input('boardId', boardId).query(valuesQuery);
        const itemsPromise = connection.request().input('boardId', boardId).query(itemsQuery);
        const groupsPromise = connection.request().input('boardId', boardId).query(groupsQuery);
        const [valuesResult, itemsResult, groupsResult] = await Promise.all([valuesPromise, itemsPromise, groupsPromise]);

        const { recordset: groups } = groupsResult;

        if (!groups || groups.length === 0) {
            return [];
        }

        groups.forEach(group => {
            const groupData: GroupData = {
                id: group.id,
                name: group.name,
                position: group.position,
                color: group.color,
                items: []
            };

            const { recordset: itemRecords } = itemsResult;
            const { recordset: valueRecords } = valuesResult;

            const itemsByGroup = itemRecords.filter(item => item.groupId === group.id);

            itemsByGroup.forEach(item => {
                const itemValues = valueRecords.filter(value => value.itemId === item.id);
                const itemData = {
                    id: item.id,
                    groupId: item.groupId,
                    projectId: item.projectId,
                    name: item.name,
                    position: item.position,
                    values: itemValues
                };
                groupData.items.push(itemData);
            });

            result.push(groupData);
        });

        return result;
    } catch (error) {
        throw new CustomError(500, 'Error al obtener los datos del tablero', error instanceof Error ? error.message : error?.toString());
    }
}

export async function getBoardColumns(boardId: string): Promise<ColumnData[]> {
    try {
        await connection.connect();
        const query: string = `
            SELECT 
                c.id,
                c.name,
                c.type,
                c.position,
                c.column_width as columnWidth
            FROM Columns c
            LEFT JOIN Boards b ON c.board_id = b.id
            WHERE b.id = @boardId 
                AND c.deleted_at IS NULL
            ORDER BY c.position
        `;

        const result = await connection
            .request()
            .input('boardId', boardId)
            .query(query);

        return result.recordset;
    } catch (error) {
        throw new CustomError(500, 'Error al obtener las columnas del tablero', error instanceof Error ? error.message : error?.toString());
    }
}
