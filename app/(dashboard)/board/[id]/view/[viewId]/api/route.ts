import { NextRequest, NextResponse } from "next/server";
import ExcelJS from 'exceljs';
import { getBoardItemsGrouped } from "@/actions/dashboard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; viewId: string }> }
) {
  const boardId = (await params).id;

  try {
    const workBook = new ExcelJS.Workbook();
    const sheetName = `Tablero-${new Date().getTime()}`
    const sheet = workBook.addWorksheet(sheetName);

    
    const firstColumn = sheet.getColumn(1); //This is the column for the item name
    const secondColumn = sheet.getColumn(2); //This is the column for the subItems name
    firstColumn.width = 100;
    secondColumn.width = 70;
    
    // Obtener los datos agrupados desde la función helper
    const groupedData = await getBoardItemsGrouped(boardId);
    
    // TODO: Style the rows
    groupedData.entries().forEach(([groupName, items]) => {      
      const defaultRecordKeys = ['itemId', 'itemName', 'itemGroupId', 'groupName', 'subItemId', 'subItemName', 'parentId', 'subItems'];
      const columnsName = Object.keys(items[0]).filter(key => !defaultRecordKeys.includes(key));
      
      sheet.addRow([groupName]);
      sheet.addRow(['Name', 'Subitems', ...columnsName]);

      items.forEach(item => {
        const itemCopy = {...item};
        const itemName = item.itemName;

        delete itemCopy.subItems;
        delete itemCopy.itemId;
        delete itemCopy.itemGroupId;
        delete itemCopy.groupName;
        delete itemCopy.itemName;

        //Construir el row de forma manual conforme a los valores del objeto y al final insertar el row
        // sheet.addRow([itemName, '', ...Object.values(itemCopy)]);
      });

      const divisionRow = sheet.addRow(['']);
      divisionRow.height = 30;
    });
    
    // Generar el buffer del archivo Excel
    const buffer = await workBook.xlsx.writeBuffer();
    
    // Crear una respuesta con el buffer y las cabeceras adecuadas para descarga
    const response = new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Tablero-${boardId}-${Date.now()}.xlsx"`,
      },
    });
    
    return response;
  } catch (error) {
    console.error("Error en la API:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

/**
 * 1. Clear fila e insertar el nombre del grupo
 * 2. Obtener las columnas del item
 * 3. Crear fila con los nombres de las columnas (insertar empezando la columna 3)
 * 4. Para la primer columna insertar el nombre del item
 * 5. Para la segunda columna insertar las filas de los subItems
 * 6. Isertar los valores de las columnas
 */