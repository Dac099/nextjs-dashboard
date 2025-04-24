import ExcelJS from 'exceljs';

/**
 * Procesa el valor de una celda que está en formato JSON
 */
export const processCellValue = (cell: ExcelJS.Cell, transformedValue: any) => {
  // Si es un objeto con color y texto (para celdas con color de fondo)
  if (
    transformedValue && 
    typeof transformedValue === 'object' && 
    'color' in transformedValue && 
    'text' in transformedValue
  ) {
    cell.fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: transformedValue.color.replace('#', 'FF') }
    };
    cell.font = { color: { argb: 'FFFFFFFF' } };
    cell.value = transformedValue.text;
    return;
  } 
  
  // Si es un array de fechas
  if (
    Array.isArray(transformedValue) && 
    transformedValue.length === 2 &&
    transformedValue.every(item => typeof item === 'string' && !isNaN(Date.parse(item)))
  ) {
    const startDate = formatDate(transformedValue[0]);
    const endDate = formatDate(transformedValue[1]);
    cell.value = `${startDate} - ${endDate}`;
    return;
  } 
  
  // Si es un string o número directo
  if (typeof transformedValue === 'string' || typeof transformedValue === 'number') {
    cell.value = transformedValue;
    return;
  }
};

/**
 * Formatea una fecha ISO a formato DD-MM-YYYY
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Procesa todas las celdas de una fila
 */
export const processRow = (row: ExcelJS.Row): void => {
  row.eachCell((cell, index) => {
    // Centrar columnas después de la segunda
    if (index > 2) {
      cell.alignment = { horizontal: 'center' };
    }

    // Procesar valor JSON si es una cadena
    if (cell.value && typeof cell.value === 'string') {
      try {
        const transformedValue = JSON.parse(cell.value);
        processCellValue(cell, transformedValue);
      } catch (error) {
        // Ignorar errores de parseo
        console.error("Error al parsear valor de celda:", error);
      }
    }
  });
};

/**
 * Establece la fuente para toda la hoja
 */
export const setSheetFont = (sheet: ExcelJS.Worksheet, fontName: string): void => {
  sheet.eachRow({ includeEmpty: true }, row => {
    row.eachCell({ includeEmpty: true }, cell => {
      cell.font = cell.font || {};
      cell.font.name = fontName;
    });
  });
};

/**
 * Crea una fila de título de grupo con el formato adecuado
 */
export const createGroupTitleRow = (
  sheet: ExcelJS.Worksheet, 
  groupName: string, 
  groupColor: string
): ExcelJS.Row => {
  const row = sheet.addRow([groupName]);
  row.font = {
    bold: true,
    size: 20,
    color: { argb: groupColor.replace('#', 'FF') }
  };
  row.height = 25;
  return row;
};

/**
 * Crea una fila de cabeceras de columnas con el formato adecuado
 */
export const createColumnsHeaderRow = (
  sheet: ExcelJS.Worksheet, 
  columnNames: string[]
): ExcelJS.Row => {
  const row = sheet.addRow(['Name', 'Subitems', ...columnNames]);
  
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFB7DEE8' }
  };
  
  row.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 13,
    };
    
    if (cell.col && Number(cell.col) > 2) {
      cell.alignment = { horizontal: 'center' };
    }
  });
  
  return row;
};

/**
 * Inicializa una hoja de Excel con configuraciones básicas
 */
export const initializeSheet = (
  workbook: ExcelJS.Workbook, 
  sheetName: string
): ExcelJS.Worksheet => {
  const sheet = workbook.addWorksheet(sheetName);
  return sheet;
};

/**
 * Configura las columnas de la hoja
 */
export const setupColumns = (
  sheet: ExcelJS.Worksheet, 
  columnNames: string[]
): void => {
  const columnsSheet = columnNames.map(column => ({ key: column }));
  columnsSheet.unshift({ key: 'Subitems' });
  columnsSheet.unshift({ key: 'Name' });
  sheet.columns = columnsSheet;
  
  // Establecer anchos de columna
  sheet.getColumn(1).width = 100; // Name column
  sheet.getColumn(2).width = 70;  // Subitems column
  
  // Establecer ancho para las demás columnas
  sheet.eachColumnKey((col) => {
    if (col.number > 2) {
      col.width = 35;
    }
  });
};

/**
 * Añade una fila de división entre grupos
 */
export const addDivisionRow = (sheet: ExcelJS.Worksheet): ExcelJS.Row => {
  const divisionRow = sheet.addRow(['']);
  divisionRow.height = 60;
  return divisionRow;
}; 