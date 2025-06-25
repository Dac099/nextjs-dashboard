'use server';
import sql from 'mssql';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';

export async function addEmptyItem(groupId: string) {
  if(!groupId) return;

  try {
    await connection.connect();
    const transaction = new sql.Transaction(connection);
    await transaction.begin();

    try {
      
    } catch (error) {
      console.error('Error on starting transaction');
      await transaction.rollback();
      throw new CustomError(
        500,
        'Error while adding empty item',
        error instanceof Error ? error.message : `${error}`
      );
    }

  } catch (error) {
    console.error('Error on adding empty item');
    throw new CustomError(
      500,
      'Error on stablish connection to DB while adding empty item',
      error instanceof Error ? error.message : `${error}`
    );
  }
}