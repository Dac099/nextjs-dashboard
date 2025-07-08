'use server';
import connection from '@/services/database';
import { ViewWithSettings } from '@/utils/types/views';

const VIEW_TYPES = {
  'Grupos': 'groups',
  'Gantt': 'gantt',
};

export async function createNewView(boardId: string, viewName: string, viewType: string): Promise<ViewWithSettings> {
  try{
    await connection.connect();
    const viewInsertion = VIEW_TYPES[viewType as keyof typeof VIEW_TYPES] || 'groups';
    const resultInsert = await connection
      .request()
      .input('boardId', boardId)
      .input('viewName', viewName)
      .input('viewType', viewInsertion)
      .query(`
        INSERT INTO Views (board_id, name, type, position)
        OUTPUT INSERTED.id
        VALUES (@boardId, @viewName, @viewType, 
          (SELECT ISNULL(MAX(position), 0) + 1 FROM Views WHERE board_id = @boardId)
        )
      `);
      const newViewId = resultInsert.recordset[0].id;
      return {
        view: {
          id: newViewId,
          name: viewName,
          type: viewType,
          is_default: false,
        },
        settings: [],
      };
  }catch(error){
    throw error;
  }
}

export async function deleteView(viewId: string): Promise<void> {
  try {
    await connection.connect();
    await connection
      .request()
      .input('viewId', viewId)
      .query(`
        UPDATE Views 
          SET deleted_at = GETDATE()
        WHERE id = @viewId
      `);
  } catch (error) {
    throw error;
  }
}