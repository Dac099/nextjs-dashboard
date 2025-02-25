'use server';
import connection from "@/services/database";

export type GanttItem = {
    task_id: string;
    task_name: string;
    resource: string;
    start_date: Date | null;
    end_date: Date | null;
    duration: number | null;
    percent_complete: number;
    dependencies: string | null;
};

export type GoogleChartData = any[][]; // Para simplificar

export async function getGanttChartData(boardId: string): Promise<GoogleChartData> {
    await connection.connect();

    // Definimos la fecha actual y la fecha futura como fallback
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setMonth(currentDate.getMonth() + 2);

    // Buscamos primero la columna de tipo timeline
    const timelineColumnQuery = `
      SELECT TOP 1 id
      FROM Columns
      WHERE board_id = @boardId 
        AND type = 'timeline' 
        AND deleted_at IS NULL
      ORDER BY position
    `;

    const timelineColumnResult = await connection
        .request()
        .input('boardId', boardId)
        .query(timelineColumnQuery);

    // Si no hay columna timeline, podemos usar un ID que no existirá
    const timelineColumnId = timelineColumnResult.recordset.length > 0
        ? timelineColumnResult.recordset[0].id
        : '00000000-0000-0000-0000-000000000000';

    // Obtener datos de los grupos
    const groupsQuery = `
      SELECT 
          CAST(g.id AS NVARCHAR(36)) AS task_id,
          g.name AS task_name,
          g.color AS resource,
          NULL AS dependencies,
          'group' AS task_type
      FROM Groups g
      WHERE g.board_id = @boardId 
        AND g.deleted_at IS NULL
      ORDER BY g.position
    `;

    const groupsResult = await connection
        .request()
        .input('boardId', boardId)
        .query(groupsQuery);

    // Obtener datos de los items
    const itemsQuery = `
      SELECT 
          CAST(i.id AS NVARCHAR(36)) AS task_id,
          i.name AS task_name,
          g.color AS resource,
          CAST(i.group_id AS NVARCHAR(36)) AS dependencies,
          'item' AS task_type
      FROM Items i
      JOIN Groups g ON i.group_id = g.id
      WHERE g.board_id = @boardId 
        AND i.deleted_at IS NULL 
        AND g.deleted_at IS NULL
      ORDER BY i.position
    `;

    const itemsResult = await connection
        .request()
        .input('boardId', boardId)
        .query(itemsQuery);

    // Obtener valores de timeline - SIN procesar JSON en SQL
    const timelineValuesQuery = `
      SELECT 
          tv.item_id,
          tv.value  -- Obtenemos el valor completo como string
      FROM TableValues tv
      WHERE tv.column_id = @columnId
        AND tv.deleted_at IS NULL
    `;

    const timelineValuesResult = await connection
        .request()
        .input('columnId', timelineColumnId)
        .query(timelineValuesQuery);

    // Crear un mapa para facilitar la búsqueda de valores de timeline
    // Hacemos el parsing de JSON en JavaScript, no en SQL
    const timelineMap = new Map();
    timelineValuesResult.recordset.forEach(record => {
        try {
            // El valor está almacenado como un string JSON, lo parseamos aquí
            const parsedValue = JSON.parse(record.value);

            // El formato es ["2025-01-01T06:00:00.000Z","2025-05-02T05:59:59.999Z"]
            if (Array.isArray(parsedValue) && parsedValue.length >= 2) {
                timelineMap.set(record.item_id, {
                    start_date: new Date(parsedValue[0]),
                    end_date: new Date(parsedValue[1])
                });
            }
        } catch (error) {
            console.error('Error parsing timeline value:', error);
            // Si hay error, simplemente no agregamos este valor al mapa
        }
    });

    // Unir los resultados de grupos e items
    const allItems: GanttItem[] = [
        ...groupsResult.recordset.map(item => ({
            ...item,
            start_date: currentDate,
            end_date: futureDate,
            duration: null,
            percent_complete: 100
        })),
        ...itemsResult.recordset.map(item => {
            // Buscar fechas de timeline para este item
            const timelineData = timelineMap.get(item.task_id);

            return {
                ...item,
                // Usar fechas del timeline si existen, de lo contrario usar fechas por defecto
                start_date: timelineData?.start_date || currentDate,
                end_date: timelineData?.end_date || futureDate,
                duration: null,
                percent_complete: 100
            };
        })
    ];

    // Definimos las columnas según el formato de Google Charts
    const columns = [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "string", label: "Resource" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" }
    ];

    // Transformamos cada fila de resultados al formato final
    const rows = allItems.map(item => [
        item.task_id,
        item.task_name,
        item.resource,
        item.start_date,
        item.end_date,
        null,             // Duración (Google Charts lo calcula automáticamente)
        item.percent_complete,
        item.dependencies
    ]);

    // Retornamos el array combinado de columnas y filas
    return [columns, ...rows];
}