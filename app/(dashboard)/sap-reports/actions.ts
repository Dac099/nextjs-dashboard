'use server';
import { CustomError } from '@/utils/customError';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export async function getFileData(): Promise<[string, string]> {
  let fileData = null;
  let fileDate = null;

  try {
    const filePath = path.join(process.cwd(), 'reports', 'sap-reports.txt');
    
    // Especificar la codificación UTF-16 Little Endian
    const fileContent = await readFile(filePath, 'utf16le');
    const statsFile = await stat(filePath);
    
    fileDate = statsFile.mtime.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    fileData = fileContent;
    console.log(1, fileData);

    return [fileData, fileDate];
  }catch(error){
    console.log(error);

    if(error.code === 'ENOENT') {
      throw new CustomError(
        500, 
        'No se encontró ningún archivo',
        'Intente subir un archivo de seguimiento de compras'
      );
    }

    throw new CustomError(
      500, 
      'Ocurrió un error al obtener la información',
      'Intente de nuevo o contate a sistemas'
    );
  }
}