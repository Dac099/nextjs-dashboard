'use server';
import connection from '@/services/database';
import type { SapReportRecord } from '@/utils/types/sapReports';

export async function getSapReports(): Promise<SapReportRecord[]> {
  try{
    await connection.connect();
    const results = await connection.request().query('SELECT * FROM FileDataCache');
    return results.recordset as SapReportRecord[];
  }catch(error){
    throw error;
  }
}