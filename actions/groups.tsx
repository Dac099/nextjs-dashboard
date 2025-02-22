'use server';
import connection from "@/services/database";
import {revalidatePath} from "next/cache";
import {
  ColumnsGroups, 
  ColumnsGroupsDB,
  GroupItem,
  Item,
  TableValue,
  ItemValues,
  BoardData,
} from "@/utils/types/groups";

export async function addGroup(boardId: string, name: string, viewId: string, color: string): Promise<void>
{
  await connection.connect();
  const query: string = `
    INSERT INTO Groups (board_id, name, position, color)
    VALUES (@boardId, @name, 
      (SELECT ISNULL(MAX(position), 0) + 1 FROM Groups WHERE board_id = @boardId AND deleted_at IS NULL)
    , @color)
  `;
  await connection
      .request()
      .input('boardId', boardId)
      .input('name', name)
      .input('color', color)
      .query(query);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function GetBoardData(boardId: string): Promise<BoardData>
{
  const [columnsGroups, boardItems, boardValues] = await Promise.all([
    fetchColumnsGroups(boardId),
    fetchBoardItems(boardId),
    fetchBoardValues(boardId)
  ]);

  return {
    columns: columnsGroups.columns || new Map(),
    groups: columnsGroups.groups || new Map(),
    itemsByGroup: boardItems || new Map(),
    valuesByItem: boardValues || new Map()
  };
}

async function fetchBoardValues(boardId: string): Promise<ItemValues>
{
  const valuesQuery: string = `
    SELECT 
      tv.id,
      tv.item_id as itemId,
      tv.column_id as columnId,
      tv.value
    FROM TableValues tv  
    INNER JOIN Items i on i.id = tv.item_id
    INNER JOIN Groups g on i.group_id = g.id
    WHERE g.board_id = @boardId AND tv.deleted_at IS NULL
  `;

  await connection.connect();
  const result = await connection
    .request()
    .input('boardId', boardId)
    .query(valuesQuery);

  return result.recordset.reduce((acc: ItemValues, curr: TableValue) => {
    if (!acc.has(curr.itemId)) {
      acc.set(curr.itemId, []);
    }

    acc.get(curr.itemId)!.push({
      id: curr.id,
      itemId: curr.itemId,
      groupId: curr.groupId,
      value: curr.value
    });
    return acc;
  }, new Map<string, TableValue[]>());
}

async function fetchBoardItems(boardId: string): Promise<GroupItem>
{
  await connection.connect();
  const query: string = `
    SELECT 
        i.id,
        i.name,
        i.group_id as groupId,
        i.position
    FROM Items i
    INNER JOIN Groups g on i.group_id = g.id
    WHERE g.board_id = @boardId AND g.deleted_at IS NULL
    ORDER BY i.group_id, i.position
  `;

  const result = await connection
    .request()
    .input('boardId', boardId)
    .query(query);

  return result.recordset.reduce((acc: GroupItem, curr: Item) => {
    if (!acc.has(curr.groupId)) {
      acc.set(curr.groupId, []);
    }

    acc.get(curr.groupId)!.push({
      id: curr.id,
      name: curr.name,
      groupId: curr.groupId,
      position: curr.position
    });
    return acc;
  }, new Map<string, Item[]>());
}

async function fetchColumnsGroups(boardId: string): Promise<ColumnsGroups>
{
  await connection.connect();
  const boardQuery: string = `
    SELECT 
      g.id as groupId,
      g.name as groupName, 
      g.color as groupColor, 
      g.position as groupPosition,
      c.id as columnId,
      c.name as columnName,
      c.type as columnType,
      c.position as columnPosition
    FROM Groups g
    LEFT JOIN Columns c on g.board_id = c.board_id
    WHERE g.board_id = @boardId AND g.deleted_at IS NULL
    ORDER BY g.position, c.position ASC
  `;

  const result = await connection
    .request()
    .input('boardId', boardId)
    .query(boardQuery);
  
  return result.recordset.reduce((acc: ColumnsGroups, curr: ColumnsGroupsDB) => {
    acc.groups.set(curr.groupId, {
      id: curr.groupId,
      name: curr.groupName,
      color: curr.groupColor,
      position: curr.groupPosition
    });

    acc.columns.set(curr.columnId, {
      id: curr.columnId,
      name: curr.columnName,
      type: curr.columnType,
      position: curr.columnPosition
    });
    
    return acc;
  }, 
  { 
    groups: new Map<string, {id: string, name: string, color: string, position: number}>(), 
    columns: new Map<string, {id: string, name: string, type: string, position: number}>() 
  });
};

export async function addBoardColumn(boardId: string, viewId: string, columnType: string): Promise<void>
{
  await connection.connect();
  let columnName: string = '';

  switch(columnType)
  {
    case 'text':
      columnName = 'Textos';
      break;
    case 'number':
      columnName = 'Números'
      break;
    case 'date':
      columnName = 'Fechas'
      break;
    case 'timeline':
      columnName = 'TimeLine'
      break;
    case 'status':
      columnName = 'Estados'
      break;
    case 'person':
      columnName = 'Personas'
      break;
  }

  const findColumnQuery: string = `
    SELECT COUNT(name) as total
    FROM Columns
    WHERE board_id = @boardId AND name = @columnName AND deleted_at IS NULL
  `;

  let result = await connection
    .request()
    .input('boardId', boardId)
    .input('columnName', columnName)
    .query(findColumnQuery);

  if(result.recordset[0].total > 0)
  {
    columnName = `${columnName} ${result.recordset[0].total}`;
  }

  const insertColumnQuery: string = `
    INSERT INTO Columns (board_id, name, type, position)
    VALUES (@boardId, @columnName, @columnType,
      (
        SELECT ISNULL(MAX(position), 0) + 1 
        FROM Columns WHERE board_id = @boardId AND deleted_at IS NULL
      )
    )
  `;

  result = await connection
    .request()
    .input('boardId', boardId)
    .input('columnName', columnName)
    .input('columnType', columnType)
    .query(insertColumnQuery);
  
  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function updateColumnName(columnId: string, name: string, boardId: string, viewId: string): Promise<void>
{
  await connection.connect();
  const query: string = `
    UPDATE Columns 
    SET name = @name
    WHERE id = @columnId
  `;

  await connection
    .request()
    .input('columnId', columnId)
    .input('name', name)
    .query(query);
  
  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function updateGroupTitle(groupId: string, name: string): Promise<void>
{
  await connection.connect();
  const query: string = `
    UPDATE Groups 
    SET 
      name = @name,
      updated_at = GETDATE()
    WHERE id = @groupId
  `;
  await connection
    .request()
    .input('groupId', groupId)
    .input('name', name)
    .query(query);
}

export async function updateGroupColor(groupId: string, color: string, boardId: string, viewId: string): Promise<void>
{
  await connection.connect();

  const query: string = `
    UPDATE Groups
    SET
      color = @color,
      updated_at = GETDATE()
    WHERE id = @groupId
  `;

  await connection
    .request()
    .input('groupId', groupId)
    .input('color', color)
    .query(query);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
}