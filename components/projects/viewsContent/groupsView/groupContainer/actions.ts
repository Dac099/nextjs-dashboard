'use server';
import sql from 'mssql';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';
import { GroupData, ItemData } from '@/utils/types/views';
import { insertNewLog } from '@/actions/logger';

export async function addEmptyItem(groupId: string, itemName: string): Promise<ItemData> {
  if (!groupId) {
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

      await insertNewLog(result.recordset[0].id, itemName, 'Item', 'CREATE');

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

export async function renameGroup(groupId: string, newName: string, prevName: string) {
  try {
    await connection.connect();
    await connection
      .request()
      .input('groupId', groupId)
      .input('newName', newName)
      .query(`
        UPDATE Groups
        SET name = @newName,
          updated_at = GETDATE()
        WHERE id = @groupId  
      `);

    await insertNewLog(groupId, prevName, 'Group', 'UPDATE');
  } catch (error) {
    throw error;
  }
}

export async function deleteGroup(groupId: string): Promise<void> {
  try {
    await connection.connect();
    const trans = new sql.Transaction(connection);
    try {
      await trans.begin();
      const updateGroupRes = await trans
        .request()
        .input('groupId', groupId)
        .query(`
          UPDATE Groups
          SET deleted_at = GETDATE()
          WHERE id = @groupId
        `);

      if(updateGroupRes.rowsAffected[0] === 0) {
        throw new Error(`El grupo con el ID ${groupId} no existe`);
      }

      await trans
        .request()
        .input('groupId', groupId)
        .query(`
          UPDATE Items
          SET deleted_at = GETDATE()
          WHERE group_id = @groupId
        `);

      await trans
        .request()
        .input('groupId', groupId)
        .query(`
          UPDATE TableValues
          SET TableValues.deleted_at = GETDATE()
          FROM TableValues tv
          INNER JOIN Items i on tv.item_id = i.id
          WHERE i.group_id = @groupId
        `);

      await insertNewLog(groupId, '', 'Group', 'DELETE');

      await trans.commit();
    } catch (error) {
      await trans.rollback();
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

export async function getBoardGroups(groupId: string): Promise<{id: string, name: string}[]>{
  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('groupId', groupId)
      .query(`
        SELECT 
          c.id,
          c.name
        FROM Columns c
        INNER JOIN Groups g ON g.board_id = c.board_id
        WHERE g.id = @groupId  
        ORDER BY c.position ASC
      `);

      return result.recordset;
  } catch (error) {
    throw error;
  }
}

export async function duplicateGroup(groupId: string, selectedColumns: {id: string, name: string}[]): Promise<GroupData> {
  try {
    await connection.connect();
    
    // 1. Crear una string con los IDs de columnas seleccionadas
    const columnIdsString = selectedColumns.length > 0
      ? selectedColumns.map(col => col.id).join(',')
      : null;
    
    // 2. Ejecutar el stored procedure dentro de una transacción explícita
    // (Esto es opcional, ya que el SP maneja su propia transacción)
    const trans = new sql.Transaction(connection);
    try {
      await trans.begin();
      
      const result = await trans
        .request()
        .input('GroupId', sql.UniqueIdentifier, groupId)
        .input('SelectedColumnIds', sql.NVarChar(sql.MAX), columnIdsString)
        .execute('sp_DuplicateGroup');
      
      // 3. Procesar el resultado para crear el objeto GroupData
      const newGroup: GroupData = {
        id: '',
        name: '',
        color: '',
        position: 0,
        items: []
      };
      
      // Usamos un Map para agrupar los items y sus valores
      const itemsMap = new Map<string, ItemData>();
      
      // Si no hay resultados, hacemos rollback y lanzamos error
      if (!result.recordset || result.recordset.length === 0) {
        await trans.rollback();
        throw new CustomError(
          500, 
          'No se pudo duplicar el grupo', 
          'El stored procedure no devolvió resultados'
        );
      }
      
      // Procesar el recordset
      result.recordset.forEach(record => {
        // Datos del grupo (solo se asignan una vez)
        if (!newGroup.id) {
          newGroup.id = record.id;
          newGroup.name = record.name;
          newGroup.color = record.color;
          newGroup.position = record.position;
        }
        
        // Procesar items y sus valores
        if (record.itemId) {
          // Si es la primera vez que vemos este item, lo creamos
          if (!itemsMap.has(record.itemId)) {
            const newItem: ItemData = {
              id: record.itemId,
              groupId: newGroup.id,
              name: record.itemName,
              position: record.itemPosition,
              projectId: record.itemProjectId || null, // Manejar caso de null
              values: []
            };
            
            itemsMap.set(record.itemId, newItem);
            newGroup.items.push(newItem);
          }
          
          // Si hay un valor de columna, lo agregamos al item correspondiente
          if (record.valueId) {
            const item = itemsMap.get(record.itemId);
            item?.values.push({
              id: record.valueId,
              columnId: record.columnId,
              value: record.value,
              itemId: record.itemId
            });
          }
        }
      });
      
      // Registrar la operación en los logs
      await insertNewLog(newGroup.id, newGroup.name, 'Group', 'CREATE');
      
      await trans.commit();
      return newGroup;
      
    } catch (error) {
      await trans.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error en duplicateGroup:', error);
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError(
        500,
        'Error al duplicar el grupo',
        'Ocurrió un problema durante la operación de duplicación'
      );
    }
  }
}