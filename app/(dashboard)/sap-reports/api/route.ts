import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, access } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('report[]') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' }, 
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.name.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos .txt' }, 
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    const reportsDir = path.join(process.cwd(), 'reports');
    try {
      await mkdir(reportsDir, { recursive: true });
    } catch {
      // El directorio ya existe, continuar
    }

    const targetPath = path.join(process.cwd(), 'reports', 'sap-reports.txt');
    
    // Verificar si el archivo ya existe y eliminarlo
    try {
      await access(targetPath);
      await unlink(targetPath);
      console.log('Archivo existente eliminado:', targetPath);
    } catch {
      // El archivo no existe, continuar
      console.log('No existe archivo previo, creando nuevo archivo');
    }

    // Leer el contenido del archivo
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    
    // Guardar el nuevo archivo
    await writeFile(targetPath, buffer);
    
    console.log('Archivo guardado exitosamente en:', targetPath);
    
    return NextResponse.json({ 
      success: true,
      message: 'Archivo subido y guardado exitosamente',
      filename: file.name,
      size: file.size,
      path: targetPath,
      uploadDate: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el archivo' }, 
      { status: 500 }
    );
  }
}