'use server';
import sql from 'mssql';
import connection from '@/services/database';
import { ItemData, ColumnData, ItemValue } from '@/utils/types/views';
import { CustomError } from '@/utils/customError';

export async function setPercentageValue(item: ItemData, column: ColumnData, value: Partial<ItemValue>){
  try {
    await connection.connect();
    const transacction = new sql.Transaction(connection);
    await transacction.begin();
    
    try {
      const parsedValue = parseFloat(value.value!);
      const requestGroupPosition = transacction
        .request()
        .input('groupId', item.groupId)
        .query('SELECT position FROM groups WHERE id = @groupId');

      const lastPositionGroups = await transacction
        .request()
        .input('groupId', item.groupId)
        .query('SELECT position FROM groups WHERE id = @groupId');

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