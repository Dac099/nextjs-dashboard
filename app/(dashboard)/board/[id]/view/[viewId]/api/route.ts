// Inside app/(dashboard)/board/[id]/view/[viewId]/api/route.ts
import { NextRequest, NextResponse } from "next/server";
import connection from "@/services/database";
import ExcelJS from 'exceljs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; viewId: string }> }
) {
  const boardId = (await params).id;

  try {
    await connection.connect();
    
    const workBook = new ExcelJS.Workbook();
    const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const boardGroupsQuery: string = `
      SELECT 
        g.name as groupName,
        g.id as groupId,
        b.name as boardName,
        g.color as groupColor
      FROM Groups g
      RIGHT JOIN Boards b ON b.id = g.board_id
      WHERE g.deleted_at IS NULL AND b.id = @boardId
      ORDER BY g.position;
    `;

    type BoardGroup = {
      groupName: string;
      groupId: string;
      boardName: string;
      groupColor: string;
    };

    type ColumnGroup = {
      columnName: string;
      columnType: string;
      columnId: string;
    };

    const boardGroupsResult = await connection
      .request()
      .input("boardId", boardId)
      .query(boardGroupsQuery);

    const boardColumnsResult = await connection
      .request()
      .input('boardId', boardId)
      .query(`
        SELECT 
          c.name as columnName,
          c.type as columnType,
          c.id as columnId
        FROM Columns c
        LEFT JOIN Boards b on b.id = c.board_id 
        WHERE b.id = @boardId
          AND c.deleted_at IS NULL
        ORDER BY c.position ASC  
      `);

    if (boardGroupsResult.recordset.length === 0 || boardColumnsResult.recordset.length === 0) {
      await connection.close();
      return NextResponse.json(
        { error: "Empty board cannot be exported" },
        { status: 400 }
      );
    }

    const sheet = workBook.addWorksheet(
      boardGroupsResult.recordset[0].boardName
    );

    const firstColumn = sheet.getColumn(1); //This is the column for the item name
    const secondColumn = sheet.getColumn(2); //This is the column for the subItems
    firstColumn.width = 100;
    secondColumn.width = 100;

    boardColumnsResult.recordset.forEach((col: ColumnGroup, index: number) => {
      const sheetColumn = sheet.getColumn(index + 3);
      sheetColumn.width = 25;
    });

    boardGroupsResult.recordset.forEach((group: BoardGroup) => {
      const groupTitleRow = sheet.addRow([group.groupName]);
      groupTitleRow.font = {
        bold: true,
        color: { argb: group.groupColor ? `FF${group.groupColor.replace('#', '')}` : 'FF000000' },
        size: 18,
      };

      const columnsName = boardColumnsResult.recordset.map((column: ColumnGroup) => column.columnName);
      columnsName.unshift('Subitems');
      columnsName.unshift('Item Name');
      const columnsRow = sheet.addRow(columnsName);
      columnsRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffe7e6e6' },
        bgColor: { argb: 'ff000000' }
      };
      columnsRow.font = {
        bold: true,
        size: 13
      };
      columnsRow.eachCell(cell => cell.alignment = { horizontal: 'center' });

      const finalRow = sheet.addRow([]);
      finalRow.height = 50;
    });

    const buffer = await workBook.xlsx.writeBuffer();
    
    await connection.close();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${boardGroupsResult.recordset[0].boardName}.xlsx"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    // Make sure to close the connection on error
    try {
      await connection.close();
    } catch (closeError) {
      console.error("Error closing connection:", closeError);
    }

    console.error("Error generating Excel file:", error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}