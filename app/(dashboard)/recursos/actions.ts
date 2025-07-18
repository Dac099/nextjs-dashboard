'use server';
import connection from '@/services/database';
import { formatEmployeesData } from '@/utils/helpers';
import { FilteredEmployeeWithItems } from '@/utils/types/projectDetail';

export async function getResources() {
  try {
    await connection.connect();

    const result = await connection
      .request()
      .query(`
        SELECT 
          e.id, 
          CONCAT(e.name, ' ', e.paternalSurname, ' ', e.maternalSurname) AS name, 
          e.department, 
          e.position,
          STRING_AGG(CAST(i.id AS NVARCHAR(36)), ',') AS itemIds,
          STRING_AGG(i.name, ',') AS itemNames
        FROM Employees e
        LEFT JOIN UserAsignedToItem uai ON uai.userId = e.id
        LEFT JOIN Items i ON i.id = uai.itemId
        GROUP BY e.id, e.name, e.department, e.position, e.paternalSurname, e.maternalSurname
      `);

    return formatEmployeesData(result.recordset as FilteredEmployeeWithItems[]);

  } catch (error) {
    throw error;
  }
}