'use server';
import sql from 'mssql';
import connection from '@/services/database';
import { ItemData, ColumnData, ItemValue } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';

export async function setPercentageValue(item: ItemData, column: ColumnData, value: Partial<ItemValue>): Promise<ItemValue>{
  try {
    await connection.connect();
    const transacction = new sql.Transaction(connection);
    await transacction.begin();
    console.log(2, 'Inicia transaccion');
    try {
      const parsedValue = parseFloat(value.value!);
      const requestGroupPosition = await transacction
        .request()
        .input('groupId', item.groupId)
        .query('SELECT position FROM Groups WHERE id = @groupId');

      const requestLastPositionGroups = await transacction
        .request()
        .input('groupId', item.groupId)
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

      const lastPosition = requestLastPositionGroups.recordset[0].lastPosition;
      const groupPosition = requestGroupPosition.recordset[0].position;
      const isUpdateValue = value.id !== undefined;
      console.log(1, lastPosition, groupPosition, isUpdateValue);
      
      if(parsedValue < 100 && groupPosition === lastPosition){
        if (isUpdateValue) {
          await transacction
            .request()
            .input('id', value.id)
            .input('value', parsedValue)
            .query(`
              UPDATE TableValues 
              SET value = @value,
                updated_at = GETDATE()
              WHERE id = @id`
            );

            await transacction.commit();
            return {
              id: value.id!,
              itemId: item.id,
              columnId: column.id,
              value: parsedValue.toString(),
            };
        } else {
          const resultInsertion = await transacction
            .request()
            .input('itemId', item.id)
            .input('columnId', column.id)
            .input('value', parsedValue)
            .query(`
              INSERT INTO TableValues (item_id, column_id, value) 
              OUTPUT INSERTED.id 
              VALUES (@itemId, @columnId, @value)
            `);

            await transacction.commit();
            return {
              id: resultInsertion.recordset[0].id,
              itemId: item.id,
              columnId: column.id,
              value: parsedValue.toString(),
            };
        }
      }

      if(parsedValue === 100 && groupPosition < lastPosition){
        if(isUpdateValue){
          await transacction
            .request()
            .input('id', value.id)
            .query(`
              UPDATE TableValues
              SET value = 0,  
                updated_at = GETDATE(),
              WHERE id = @id 
            `);
          const groupsListResult = await transacction
            .request()
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
          const currentGroupIndex = groupsListResult.recordset.findIndex(group => group.id === item.groupId);
          const nextGroup = groupsListResult.recordset[currentGroupIndex + 1];

          await transacction
            .request()
            .input('nextGroupId', nextGroup.id)
            .input('itemId', item.id)
            .query(`
              UPDATE Items
              SET group_id = @nextGroupId,
                updated_at = GETDATE()
              WHERE id = @itemId
            `);
          await transacction.commit();
          return {
            id: value.id!,
            itemId: item.id,
            columnId: column.id,
            value: '0',
          };
        }else {
          const resultInsertion = await transacction
            .request()
            .input('itemId', item.id)
            .input('columnId', column.id)
            .input('value', parsedValue)
            .query(`
              INSERT INTO TableValues (item_id, column_id, value) 
              OUTPUT INSERTED.id 
              VALUES (@itemId, @columnId, @value)
            `);
          
          const groupsListResult = await transacction
            .request()
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
          const currentGroupIndex = groupsListResult.recordset.findIndex(group => group.id === item.groupId);
          const nextGroup = groupsListResult.recordset[currentGroupIndex + 1];

          await transacction
            .request()
            .input('nextGroupId', nextGroup.id)
            .input('itemId', item.id)
            .query(`
              UPDATE Items
              SET group_id = @nextGroupId,
                updated_at = GETDATE()
              WHERE id = @itemId
            `);
          await transacction.commit();
          return {
            id: resultInsertion.recordset[0].id,
            itemId: item.id,
            columnId: column.id,
            value: parsedValue.toString(),
          };
        }
      }

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