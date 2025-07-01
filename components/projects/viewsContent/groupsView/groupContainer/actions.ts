'use server';
import sql from 'mssql';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';
import { ItemData } from '@/utils/types/views';

export async function addEmptyItem(groupId: string, itemName: string): Promise<ItemData> {
  if(!groupId){
    throw new CustomError(
      400,
      'ID de grupo no proporcionado',
      'El ID del grupo es necesario para agregar el item'
    );
  }

  try {
    await connection.connect();
    const transaction = new sql.Transaction(connection);
    await transaction.begin();

    try {
      const result = await transaction
        .request()
        .input('groupId', groupId)
        .input('itemName', itemName)
        .query(`
          INSERT INTO Items (group_id, name, position)  
          OUTPUT INSERTED.*
          VALUES (
            @groupId, 
            @itemName, 
            (SELECT ISNULL(MAX(position), 0) + 1 FROM Items WHERE group_id = @groupId)
          )
        `);

      await transaction.commit();     

      return {
        id: result.recordset[0].id,
        groupId,
        projectId: null,
        name: itemName,
        position: result.recordset[0].position,
        values: []
      } 
    } catch (error) {
      console.error('Error while adding empty item:', error);
      await transaction.rollback();
      throw new CustomError(
        500,
        'Error al agregar el elemento vacío',
        'Intente nuevamente o llame a sistemas'
      );
    }

  } catch (error) {
    console.error(error);
    throw new CustomError(
      500,
      'Error al conectarse a la base de datos',
      'Ocurrió un problema al conectarse a DB o al iniciar la transacción'
    );
  }
}