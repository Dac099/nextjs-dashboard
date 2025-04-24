import { NextRequest, NextResponse } from "next/server";
import ExcelJS from 'exceljs';
import { getBoardItemsGrouped } from "@/actions/dashboard";
import { 
  initializeSheet, 
  createGroupTitleRow, 
  createColumnsHeaderRow, 
  setupColumns, 
  processRow, 
  setSheetFont, 
  addDivisionRow 
} from "@/utils/sheetHelpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; viewId: string }> }
) {
  const boardId = (await params).id;
  const searchParams = request.nextUrl.searchParams;
  
  // Obtenemos el groupId del query parameter si existe
  const groupId = searchParams.get('groupId');
  
  try {
    const workBook = new ExcelJS.Workbook();
    const sheetName = `Tablero-${new Date().getTime()}`
    const sheet = initializeSheet(workBook, sheetName);

    // Obtener los datos agrupados desde la función helper
    let groupedData = await getBoardItemsGrouped(boardId);
    
    // Filtrar por groupId si está presente en la URL
    if (groupId) {
      // Convertimos las entradas a un array para manipularlas
      const filteredEntries = [...groupedData.entries()].map(([groupName, items]) => {
        // Filtramos solo los items que tengan el groupId especificado
        const filteredItems = items.filter(item => 
          item.itemGroupId === groupId
        );
        
        // Devolvemos solo los grupos que tengan items después del filtrado
        return [groupName, filteredItems] as [string, typeof items];
      }).filter(([_, items]) => items.length > 0);
      
      // Creamos un nuevo Map con los datos filtrados
      groupedData = new Map(filteredEntries);
    }

    // Si no hay datos para exportar, devolvemos un mensaje
    if (groupedData.size === 0) {
      return NextResponse.json(
        { error: "No hay datos para exportar con el filtro especificado" },
        { status: 404 }
      );
    }

    // Procesamos los datos filtrados
    groupedData.forEach((items, groupName) => {      
      // Evitar error si no hay items
      if (items.length === 0) return;
      
      const defaultRecordKeys = ['itemId', 'itemName', 'itemGroupId', 'groupName', 'subItemId', 'subItemName', 'parentId', 'subItems', 'groupColor'];
      const columnsName = Object.keys(items[0]).filter(key => !defaultRecordKeys.includes(key));
      
      const groupTitleRow = createGroupTitleRow(sheet, groupName, items[0].groupColor);
      const columnsRow = createColumnsHeaderRow(sheet, columnsName);
      
      setupColumns(sheet, columnsName);
      
      items.forEach(item => {
        const itemRow = {
          Name: item.itemName,
          Subitems: '',
        };

        //If the item has subItem then insert the itemName and create new rows for the subItems
        if(item.subItems.length > 0){
          sheet.addRow(itemRow);

          item.subItems.forEach((subItem: any) => {
            const subItemRowData = {
              Name: '',
              Subitems: subItem.subItemName, 
            };

            columnsName.forEach(column => Object.defineProperty(subItemRowData, column, {
              writable: false,
              value: subItem[column]
            }));

            const rowInserted = sheet.addRow(subItemRowData);
            rowInserted.height = 20;

            processRow(rowInserted);
          });

          return;
        }

        columnsName.forEach(column => Object.defineProperty(itemRow, column, {
          writable: false,
          value: item[column]
        }));

        const rowInserted = sheet.addRow(itemRow);
        rowInserted.height = 20;

        processRow(rowInserted);
      });

      addDivisionRow(sheet);
    });

    // Establecer fuente para toda la hoja
    setSheetFont(sheet, 'Arial');
    
    // Generar el buffer del archivo Excel
    const buffer = await workBook.xlsx.writeBuffer();
    
    // Incluir información de filtro en el nombre del archivo
    let filename = `Tablero-${boardId}`;
    if (groupId) filename += `-grupo-${groupId}`;
    filename += `-${Date.now()}.xlsx`;
    
    // Crear una respuesta con el buffer y las cabeceras adecuadas para descarga
    const response = new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
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
