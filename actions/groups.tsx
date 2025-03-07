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
  BoardData, Group,
} from "@/utils/types/groups";
import sql from "mssql";
import {buildInsertItemsBatchQuery} from "@/utils/actionsGrups/helpers";

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
      value: curr.value,
      columnId: curr.columnId,
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
    WHERE g.board_id = @boardId AND g.deleted_at IS NULL AND i.deleted_at IS NULL
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
    WHERE g.board_id = @boardId AND g.deleted_at IS NULL AND c.deleted_at IS NULL
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
}

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

  const result = await connection
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

  await connection
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

export async function addItemBoard(groupId: string, viewId: string, boardId: string, itemName: string): Promise<void>
{
  const addItemQuery: string = `
    INSERT INTO Items (group_id, name, position)
    VALUES (@groupId, @name,
        (SELECT ISNULL(MAX(position), 0) + 1 FROM Items 
        WHERE group_id = @groupId AND deleted_at IS NULL)
    )
  `;

  await connection.connect();
  await connection
      .request()
      .input('groupId', groupId)
      .input('name', itemName)
      .query(addItemQuery);

  revalidatePath(`board/${boardId}/view/${viewId}`);
}

export async function setTableValue(
    boardId: string,
    viewId: string,
    itemId: string | undefined,
    columnId: string | undefined,
    value: string,
    valueId: string | undefined
): Promise<void> {
  await connection.connect();

  const updateValueQuery: string = `
    UPDATE TableValues
    SET 
        value = @value,
        updated_at = GETDATE()
    WHERE id = @valueId
  `;

  if(!valueId)
  {
    const setValueQuery: string = `
        INSERT INTO TableValues (item_id, column_id, value)
        VALUES (@itemId, @columnId, @value);
    `;
    await connection
        .request()
        .input('itemId', itemId)
        .input('columnId', columnId)
        .input('value', value)
        .query(setValueQuery);
  }

  await connection
      .request()
      .input('valueId', valueId)
      .input('value', value)
      .query(updateValueQuery);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function getBoardStatusList(columnId: string): Promise<{color: string, text: string, id: string}[]> {
  await connection.connect();

  const selectQuery: string = `
    SELECT 
        id,
        value 
    FROM TableValues
    WHERE column_id = @columnId 
        AND item_id IS NULL
        AND deleted_at IS NULL
    ORDER BY created_at DESC
  `;

  const result = await connection
      .request()
      .input('columnId', columnId)
      .query(selectQuery);

  return result.recordset.map((res): {color: string, text: string, id: string} => ({
    ...JSON.parse(res.value),
    id: res.id
  }));
}

export async function addStatusColumn(columnId: string, value: string, boardId: string, viewId: string): Promise<string>
{
  await connection.connect();
  const query: string = `
    INSERT INTO TableValues (column_id, value)
    OUTPUT inserted.id
    VALUES (@columnId, @value)
  `;

  const result = await connection
      .request()
      .input('columnId', columnId)
      .input('value', value)
      .query(query);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
  return result.recordset[0].id;
}

export async function deleteStatusColumn(itemId: string, boardId: string, viewId: string): Promise<void> {
  await connection.connect();
  const query: string = `
    UPDATE TableValues
    SET deleted_at = GETDATE()
    WHERE id = @itemId
  `;

  await connection
      .request()
      .input('itemId', itemId)
      .query(query);
  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function deleteGroup(groupId: string, boardId: string, viewId: string): Promise<void>
{
  await connection.connect();
  const query: string = `
    UPDATE Groups 
    SET deleted_at = GETDATE()
    WHERE id = @groupId
  `;

  await connection
      .request()
      .input('groupId', groupId)
      .query(query);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function deleteGroupRow(itemId: string, boardId: string, viewId: string): Promise<void>
{
  await connection.connect();
  const query: string = `
    UPDATE Items
    SET deleted_at = GETDATE()
    WHERE id = @itemId
  `;

  await connection
    .request()
    .input('itemId', itemId)
    .query(query);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function deleteColumn(columnId: string, boardId: string, viewId: string): Promise<void>
{
  await connection.connect();
  const query: string = `
    UPDATE Columns
    SET deleted_at = GETDATE()
    WHERE id = @colId
  `;

  await connection
    .request()
    .input('colId', columnId)
    .query(query);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function duplicateGroup(group: Group, viewId: string, boardId: string): Promise<void>{
  await connection.connect();
  const transaction = new sql.Transaction(connection);

  const getItemsQuery: string = `
    SELECT
      name,
      position
    FROM Items
    WHERE group_id = @groupId
      AND deleted_at IS NULL
  `;
  const insertGroupQuery: string = `
    INSERT INTO Groups (name, color, board_id, position)
      OUTPUT inserted.id
    VALUES (@name, @color, @boardId, (
      SELECT ISNULL(MAX(position), 0) + 1
      FROM Groups
      WHERE deleted_at IS NULL
      AND board_id = @boardId
      ))
  `;

  try {
    await transaction.begin();

    // Obtener los ítems del grupo original
    const itemsResponse = await new sql.Request(transaction)
        .input('groupId', group.id)
        .query(getItemsQuery);
    const items = itemsResponse.recordset;

    // Insertar el nuevo grupo y obtener su ID
    const groupResponse = await new sql.Request(transaction)
        .input('name', `${group.name} (copia)`)
        .input('color', group.color)
        .input('boardId', boardId)
        .query(insertGroupQuery);
    const groupId = groupResponse.recordset[0].id;

    // Si hay ítems para duplicar, insertar los ítems en el nuevo grupo
    if (items.length > 0) {
      const insertItemsQuery: string = buildInsertItemsBatchQuery(items, groupId);
      await new sql.Request(transaction).query(insertItemsQuery);
    }

    // Confirmar la transacción
    await transaction.commit();

    // Revalidar el path después de confirmar
    revalidatePath(`/board/${boardId}/view/${viewId}`);
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    console.error('Error duplicating group:', error);
    throw error;
  }
}