'use server';
import sql from 'mssql';
import connection from '@/services/database';
import { ItemData, ColumnData, ItemValue } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';

export async function setPercentageValue(item: ItemData, column: ColumnData, value: Partial<ItemValue>): Promise<[ItemValue, ItemData]>{
  try {
    await connection.connect();
    const transacction = new sql.Transaction(connection);
    await transacction.begin();
    
    try {
      const parsedValue = parseFloat(value.value!);
      const lastPosition = await getLastGroupId(transacction, item.groupId);
      const groupPosition = await getCurrentGroupPosition(transacction, item.groupId);
      const isUpdateValue = value.id !== undefined;

      /** When the value is less than 100 just update or create tehe record */
      if(parsedValue < 100){
        if (isUpdateValue) {
          const itemUpdated = await updatePercentageRecord(item, column, value as ItemValue, transacction);
          await transacction.commit();
          return [itemUpdated, item];
            
        } else {
          const itemCreated = await createPercentageRecord(item, column, value.value!, transacction);
          await transacction.commit();
          return [itemCreated, item];
        }
      }
      
      /** The value is equal to 100  */
      let itemToReturn : ItemValue;
      if(isUpdateValue){
        const valueToRecord = groupPosition === lastPosition ? value.value! : '0';
        itemToReturn = await updatePercentageRecord(item, column, {...value as ItemValue, value: valueToRecord}, transacction);
      }else{
        const valueToRecord = groupPosition === lastPosition ? value.value! : '0';
        itemToReturn = await createPercentageRecord(item, column, valueToRecord, transacction);
      }

      if(groupPosition === lastPosition){
        await transacction.commit();
        return [itemToReturn, item];
      }


      const nextGroupId = await getNextGroupId(transacction, item.groupId);
      item.groupId = nextGroupId;
      await moveItemToNextGroup(transacction, item.id, nextGroupId);
      await transacction.commit();

      return [itemToReturn, item];
    } catch (error) {
      transacction.rollback();
      console.error('Error setting percentage value:', error);
      throw new CustomError(500, 'Error al actualizar el valor del porcentaje', 'Intente nuevamente o llave a sistemas');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    throw new CustomError(500, 'Error de conexión a la base de datos', 'Intente nuevamente o llave a sistemas');
  }
}

async function updatePercentageRecord(item: ItemData, column: ColumnData, value: ItemValue, transacction: sql.Transaction): Promise<ItemValue> {
  const itemValue = value.value!;

  await transacction
    .request()
    .input('id', value.id)
    .input('value', itemValue)
    .query(`
      UPDATE TableValues 
      SET value = @value,
        updated_at = GETDATE()
      WHERE id = @id`
    );
 
  return {
    id: value.id!,
    itemId: item.id,
    columnId: column.id,
    value: itemValue,
  };
}

async function createPercentageRecord(item: ItemData, column: ColumnData, value: string, transacction: sql.Transaction): Promise<ItemValue> {
  const resultInsertion = await transacction
    .request()
    .input('itemId', item.id)
    .input('columnId', column.id)
    .input('value', value)
    .query(`
      INSERT INTO TableValues (item_id, column_id, value) 
      OUTPUT INSERTED.id 
      VALUES (@itemId, @columnId, @value)
    `);

  return {
    id: resultInsertion.recordset[0].id,
    itemId: item.id,
    columnId: column.id,
    value: value,
  };
}

async function getLastGroupId (transacction: sql.Transaction, groupId: string): Promise<number> {
  const requestLastPositionGroups = await transacction
    .request()
    .input('groupId', groupId)
    .query(`
      SELECT MAX(position) AS lastPosition
      FROM Groups
      WHERE board_id = (
        SELECT board_id 
        FROM Groups
        WHERE id = @groupId
      )
        AND deleted_at IS NULL
    `);

  const position = requestLastPositionGroups.recordset[0].lastPosition;
  return typeof position === 'number' ? position : parseInt(position, 10);
}

async function getCurrentGroupPosition(transacction: sql.Transaction, groupId: string): Promise<number> {
  const requestGroupPosition = await transacction
    .request()
    .input('groupId', groupId)
    .query('SELECT position FROM Groups WHERE id = @groupId');
  const position = requestGroupPosition.recordset[0].position;
  return typeof position === 'number' ? position : parseInt(position, 10);
}

async function getNextGroupId(transacction: sql.Transaction, groupId: string): Promise<string> {
  const groupsListResult = await transacction
    .request()
    .input('groupId', groupId)
    .query(`
      SELECT id, position
      FROM Groups
      WHERE board_id = (
        SELECT board_id 
        FROM Groups
        WHERE id = @groupId
      )
        AND deleted_at IS NULL  
      ORDER BY position ASC
    `);
  const currentGroupIndex = groupsListResult.recordset.findIndex(group => group.id === groupId);
  return groupsListResult.recordset[currentGroupIndex + 1].id;
}

async function moveItemToNextGroup(transaction: sql.Transaction, itemId: string, nextGroupId: string): Promise<void> {
  await transaction
    .request()
    .input('itemId', itemId)
    .input('nextGroupId', nextGroupId)
    .query(`
      UPDATE Items 
      SET group_id = @nextGroupId, 
          updated_at = GETDATE() 
      WHERE id = @itemId
    `);
}