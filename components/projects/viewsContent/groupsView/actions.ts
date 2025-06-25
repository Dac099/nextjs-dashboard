'use server';
import connection from '@/services/database';
import sql from 'mssql';
import { CustomError } from '@/utils/customError';

/**
 * Mueve un elemento (item) a un grupo específico
 * 
 * @param targetGroupId - El ID del grupo destino donde se moverá el elemento
 * @param itemId - El ID del elemento que se moverá
 * @returns Una promesa que se resuelve a true si la operación fue exitosa
 * @throws CustomError si ocurre algún error durante la operación
 * 
 * Esta función:
 * 1. Establece una conexión a la base de datos
 * 2. Inicia una transacción
 * 3. Calcula la nueva posición del elemento en el grupo destino (la última posición + 1)
 * 4. Actualiza el grupo y la posición del elemento
 * 5. Realiza un commit de la transacción
 */
export async function dropItemInGroup(targetGroupId: string, itemId: string): Promise<boolean> {
  // Iniciar transacción
  await connection.connect();
  const transaction = new sql.Transaction(connection);
  await transaction.begin();

  try {
    // obtener la posición mas alta del grupo destino y sumarle 1
    const positionQuery = `
      SELECT ISNULL(MAX(position), 0) + 1 as newPosition
      FROM Items
      WHERE group_id = @targetGroupId AND deleted_at IS NULL
    `;

    const positionResult = await transaction.request()
      .input('targetGroupId', targetGroupId)
      .query(positionQuery);

    const newPosition = positionResult.recordset[0].newPosition;

    // actualizar item cambiando el groupId y position
    const updateQuery = `
      UPDATE Items
      SET group_id = @targetGroupId, 
          position = @newPosition,
          updated_at = GETDATE()
      WHERE id = @itemId
    `;

    await transaction.request()
      .input('targetGroupId', targetGroupId)
      .input('newPosition', newPosition)
      .input('itemId', itemId)
      .query(updateQuery);

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    console.error('Error dropping item in group:', error);
    throw new CustomError(500, 'Error on move item in group', `${error}`);
  }
}

/**
 * Intercambia la posición de dos elementos en una tabla específica
 * 
 * @param targetElementId - El ID del elemento objetivo (destino)
 * @param draggedElementId - El ID del elemento arrastrado
 * @param tableName - El nombre de la tabla donde se realizará la operación ('Items', 'Columns' o 'Groups')
 * @returns Una promesa que se resuelve a true si la operación fue exitosa
 * @throws CustomError si ocurre algún error durante la operación
 * 
 * Esta función:
 * 1. Establece una conexión a la base de datos
 * 2. Inicia una transacción
 * 3. Obtiene las posiciones actuales de ambos elementos
 * 4. Intercambia las posiciones entre los elementos
 * 5. Realiza un commit de la transacción
 */
export async function orderElements(targetElementId: string, draggedElementId: string, tableName: 'Items' | 'Columns' | 'Groups'): Promise<boolean> {
  try {
    await connection.connect();
    const transaction = new sql.Transaction(connection);
    
    try {
      await transaction.begin();

      const selectQuery = `
        SELECT 
          id as elementId, 
          position as elementPosition
        FROM ${tableName}
        WHERE id IN (@targetElementId, @draggedElementId) AND deleted_at IS NULL
      `;

      const updateQuery = `
        UPDATE ${tableName}
        SET position = CASE
          WHEN id = @targetElementId THEN @draggedElementPosition
          WHEN id = @draggedElementId THEN @targetElementPosition
          ELSE position
        END,
        updated_at = GETDATE()
        WHERE id IN (@targetElementId, @draggedElementId)
      `;

      const positionsResult = await transaction.request()
        .input('targetElementId', targetElementId)
        .input('draggedElementId', draggedElementId)
        .query(selectQuery);

      const targetElementPosition = positionsResult.recordset.find(item => item.elementId === targetElementId).elementPosition;
      const draggedElementPosition = positionsResult.recordset.find(item => item.elementId === draggedElementId).elementPosition;

      await transaction.request()
        .input('targetElementId', targetElementId)
        .input('draggedElementId', draggedElementId)
        .input('targetElementPosition', targetElementPosition)
        .input('draggedElementPosition', draggedElementPosition)
        .query(updateQuery);

      await transaction.commit();
      return true;

    } catch (error) {
      await transaction.rollback();
      console.error('Error ordering elements:', error);
      throw new CustomError(500, 'Error on order elements', `${error}`);      
    }
  } catch (error) {
    console.error('Error on order elements while trying to connect to database:', error);
    throw new CustomError(500, 'Error on order elements', 'Error on order elements while trying to connect to database');
  }
}
