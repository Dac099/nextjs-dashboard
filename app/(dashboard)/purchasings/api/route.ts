import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { getRFQsData } from '@/components/home/progressProyects/actions';
import { getItemReportStatus } from '@/utils/helpers';

export async function GET(request: NextRequest){
  try {
    const searchParams = request.nextUrl.searchParams;
    const globalFilter = searchParams.get('globalFilter');
    const advancedFilterParam = searchParams.get('advancedFilter');
    const advancedFilter = advancedFilterParam ? JSON.parse(advancedFilterParam) : null;
    const requisitionData = (await getRFQsData(null, null, globalFilter, advancedFilter)).items;
    
    const workbook = new ExcelJS.Workbook();
    const sheetTitle = "Compras".concat(
      new Date()
        .toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/[\/,\s:]/g, ""),
      ".xlsx"
    );
    const workSheet = workbook.addWorksheet(sheetTitle);
    workSheet.columns = [
      { header: 'RFQ', key: 'rfqNumber', width: 15 },
      { header: 'Estatus RFQ', key: 'sysStatusText', width: 20 },
      { header: 'Creado por', key: 'createdBy', width: 25 },
      { header: 'Número de parte', key: 'partNumber', width: 20 },
      { header: 'Descripción', key: 'description', width: 40 },
      { header: 'Proyecto', key: 'projectId', width: 15 },
      { header: 'Proveedor', key: 'supplier', width: 30 },
      { header: 'Maquinado', key: 'machineType', width: 15 },
      { header: 'Estado', key: 'statusText', width: 20 },
      { header: 'Fecha O. Compra', key: 'poDate', width: 18 },
      { header: 'Fecha Promesa', key: 'deliveryDate', width: 18 },
      { header: 'Cantidad Solicitada', key: 'poQuantity', width: 20 },
      { header: 'Folio Recepción', key: 'warehouseTicket', width: 18 },
      { header: 'Fecha Recepción', key: 'warehouseTicketDate', width: 18 },
      { header: 'Cantidad Recibida', key: 'warehouseTicketQuantity', width: 20 },
    ];

    requisitionData.forEach(item => {
      workSheet.addRow({
        rfqNumber: item.rfqNumber,
        sysStatusText: item.sysStatusText,
        createdBy: item.createdBy,
        partNumber: item.partNumber,
        description: item.description,
        projectId: item.projectId,
        supplier: item.supplier,
        machineType: item.machineType,
        statusText: getItemReportStatus(item).text,
        poDate: item.poDate,
        deliveryDate: item.deliveryDate,
        poQuantity: item.poQuantity,
        warehouseTicket: item.warehouseTicket,
        warehouseTicketDate: item.warehouseTicketDate,
        warehouseTicketQuantity: item.warehouseTicketQuantity,
      });
    });

    // Aplicar estilo a la cabecera (primera fila)
    const headerRow = workSheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6246ea' },
      };
      cell.font = {
        color: { argb: 'FFd1d1e9' },
        size: 14,
      };
    });

    const fileBuffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${sheetTitle}"`,
      },
    });
  } catch (error) {
    console.error("API Error: ", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error),
        status: 500
    },
    );
  }
}