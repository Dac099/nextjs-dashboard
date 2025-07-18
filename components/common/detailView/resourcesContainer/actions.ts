'use server';
import connection from '@/services/database';
import sql from 'mssql';
import type { FilteredEmployee, FilteredEmployeeWithItems, userAsignedToItem } from '@/utils/types/projectDetail';
import { formatEmployeesData } from '@/utils/helpers';

export async function getFilteresEmployees(filterValue: string) {
  try {
    await connection.connect();
    
    const result = await connection
      .request()
      .input('filterValue', sql.VarChar, filterValue)
      .query<FilteredEmployeeWithItems>(`
        SELECT 
          e.id, 
          CONCAT(e.name, ' ', e.paternalSurname) AS name, 
          e.department, 
          e.position,
          STRING_AGG(CAST(i.id AS NVARCHAR(36)), ',') AS itemIds,
          STRING_AGG(i.name, ',') AS itemNames
        FROM Employees e
        LEFT JOIN UserAsignedToItem uai ON uai.userId = e.id
        LEFT JOIN Items i ON i.id = uai.itemId
        WHERE LOWER(e.name) LIKE '%' + @filterValue + '%'
          OR LOWER(e.department) LIKE '%' + @filterValue + '%'
          OR LOWER(e.position) LIKE '%' + @filterValue + '%'
        GROUP BY e.id, e.name, e.department, e.position, e.paternalSurname 
      `);        

    return formatEmployeesData(result.recordset as FilteredEmployeeWithItems[]);

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getItemEmployees(itemId: string): Promise<userAsignedToItem[]>{
  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('itemId', sql.UniqueIdentifier, itemId)
      .query<userAsignedToItem>(`
        SELECT
          e_user.id, 
          CONCAT(e_user.name, ' ', e_user.paternalSurname, ' ', e_user.maternalSurname) AS name,
          e_user.department,
          e_user.position,
          uai.asignedDate,
          e_manager.nom_user AS asignedBy
        FROM UserAsignedToItem uai
        INNER JOIN Employees e_user ON e_user.id = uai.userId  
        INNER JOIN tb_user e_manager ON e_manager.id_user = uai.asignedBy
        WHERE uai.itemId = @itemId AND uai.deleted_at IS NULL
        GROUP BY 
          e_user.id, 
          e_user.name, 
          e_user.department, 
          e_user.position, 
          uai.asignedDate, 
          e_user.paternalSurname, 
          e_user.maternalSurname,
          e_manager.nom_user
      `);

    return result.recordset as userAsignedToItem[];
  } catch (error) {
    throw error;
  }
}

export async function assignEmployeeToItem(itemId: string, employeeId: string, assignedBy: string){
  try{
    await connection.connect();
    await connection
      .request()
      .input('userId', sql.UniqueIdentifier, employeeId)
      .input('itemId', sql.UniqueIdentifier, itemId)
      .input('assignedBy', sql.Int, assignedBy)
      .query(`
        INSERT INTO UserAsignedToItem (userId, itemId, asignedBy)
        VALUES (@userId, @itemId, @assignedBy)
      `);
  }catch(error){
    throw error;
  }
}

export async function deleteEmployeeFromItem(itemId: string, employeeId: string){
  try {
    await connection.connect();
    await connection
      .request()
      .input('userId', sql.UniqueIdentifier, employeeId)
      .input('itemId', sql.UniqueIdentifier, itemId)
      .query(`
        UPDATE UserAsignedToItem
        SET deleted_at = GETDATE()
        WHERE userId = @userId AND itemId = @itemId
      `);
  } catch (error) {
    throw error;
  }
}