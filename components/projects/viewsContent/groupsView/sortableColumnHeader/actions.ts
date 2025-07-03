'use server';
import connection from '@/services/database';
import { CustomError } from '@/utils/customError';

export async function updateColumnWidth(columnId: string, width: number){
  try {
    await connection.connect();
    await connection
      .request()
      .input('columnId', columnId)
      .input('width', width)
      .query(`
        UPDATE Columns
        SET column_width = @width,
          updated_at = GETDATE()
        WHERE id = @columnId
      `);
  } catch (error) {
    console.error('Error updating column width:', error);
    throw new CustomError(
      500, 
      'Ocurrió un error al actualizar el ancho de la columna',
      `Error al establecer valor de ${width}px de ancho`
    )
  }
}
