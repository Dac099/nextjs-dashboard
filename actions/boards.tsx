'use server';
import {ViewWithSettings} from "@/utils/types/views";
import connection from '@/services/database';
import {redirect} from "next/navigation";

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
export async function getBoardViews(boardId: string): Promise<ViewWithSettings[]>
{
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
    `;
    const result = await connection
        .request()
        .input('boardId', boardId)
        .query(query);

    const resultByView: ReduceAcc =  result.recordset.reduce((acc: ReduceAcc, curr: ViewsDB) => {
        if(!acc[curr.id])
        {
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

export async function addViewBoard(boardId: string, view: ViewWithSettings): Promise<void>
{
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

export async function getViewType(viewId: string): Promise<string>
{
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

    return result.recordset[0].type;
}

export async function getWorkspaceAndBoardData(boardId: string) {
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
}