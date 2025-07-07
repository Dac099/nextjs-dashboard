'use server';
import connection from '@/services/database';
import { getSession } from './auth';

const OPERATIONS = {
  DELETE: 'eliminó',
  UPDATE: 'actualizó',
  CREATE: 'creó',
  REVERT: 'revertió'
};

const RESOURCES = {
  Column: 'una columna',
  Value: 'el valor de un item',
  Group: 'un grupo',
  Item: 'un item',
  Board: 'un tablero',
};

export async function insertNewLog(
  resourceId: string,
  valueLog: string,
  resource: 'Column' | 'Value' | 'Group' | 'Item' | 'Board',
  type: 'DELETE' | 'UPDATE' | 'CREATE' | 'REVERT'
) {
  try {
    await connection.connect();
    const { id, username } = (await getSession());
    let message: string = `[ID: ${id}] ${username} -> ${OPERATIONS[type]} ${RESOURCES[resource]}`;

    if (type === 'UPDATE') {
      message += ` de ${valueLog}`;
    }

    if (type === 'CREATE') {
      message += ` con el valor ${valueLog}`
    }

    await connection
      .request()
      .input('message', message)
      .input('resourceId', resourceId)
      .input('valueLog', valueLog)
      .input('resource', resource)
      .input('type', type)
      .query(`
        INSERT INTO EntryLogs (msg, resource_id, value_log, resource, type) 
        VALUES (@message, @resourceId, @valueLog, @resource, @type)`
      );
  } catch (error) {
    console.error('ERROR while insert operation log', error);
    throw new Error('Error al insertar log de operación', {
      cause: error,
    });
  }
}
