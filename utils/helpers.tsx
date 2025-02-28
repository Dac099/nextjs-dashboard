import { BoardData } from './types/groups';

export function formatBoardData(boardData: BoardData) {
  const { groups, columns, itemsByGroup, valuesByItem } = boardData;
  const currentDate = new Date();

  // Definición de columnas para Google Charts Gantt
  const chartColumns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  // Array para almacenar las filas del gráfico Gantt
  const chartRows = [];

  // Encontrar columnas de tipo Timeline y Status
  const timelineColumns = new Map();
  const statusColumns = new Map();

  for (const [columnId, column] of columns.entries()) {
    if (column.type === 'timeline') {
      timelineColumns.set(columnId, column);
    } else if (column.type === 'status') {
      statusColumns.set(columnId, column);
    }
  }

  // Maps para almacenar datos procesados
  const processedItems = new Map();
  const groupStartDates = new Map();
  const groupEndDates = new Map();

  // Procesar primero cada ítem
  for (const [groupId, group] of groups.entries()) {
    const items = itemsByGroup.get(groupId) || [];
    processedItems.set(groupId, []);

    for (const item of items) {
      const itemValues = valuesByItem.get(item.id) || [];

      let itemStartDate = null;
      let itemEndDate = null;
      let itemDuration = null;
      let itemProgress = 0;
      let itemResource = "Por definir"; // Valor predeterminado

      // Extraer valores de timeline y status
      for (const value of itemValues) {
        // Procesar timeline
        if (timelineColumns.has(value.columnId) && value.value) {
          try {
            const timelineDates = JSON.parse(value.value);

            if (Array.isArray(timelineDates) && timelineDates.length >= 2) {
              itemStartDate = new Date(timelineDates[0]);
              itemEndDate = new Date(timelineDates[1]);
            }
          } catch (e) {
            console.error(`Error parsing timeline value for item ${item.id}:`, e);
          }
        }

        // Procesar recursos o asignaciones
        // Aquí puedes agregar la lógica para obtener el recurso de una columna específica
        // Por ejemplo, si tienes una columna de tipo 'people' o 'person'
        if (value.columnId === 'people_column_id' && value.value) {
          try {
            const peopleData = JSON.parse(value.value);
            if (peopleData && peopleData.length > 0) {
              itemResource = peopleData[0].name || "Por definir";
            }
          } catch (e) {
            console.error(`Error parsing people value for item ${item.id}:`, e);
          }
        }

        // Procesar progreso desde columnas de status
        if (statusColumns.has(value.columnId) && value.value) {
          const statusValue = value.value;
          // Aquí puedes mapear valores de status a porcentajes de progreso
          if (statusValue === "Completo" || statusValue === "Finalizado") {
            itemProgress = 100;
          } else if (statusValue === "En progreso") {
            itemProgress = 50;
          } else if (statusValue === "No iniciado") {
            itemProgress = 0;
          }
        }
      }

      // Asignar fechas predeterminadas si no están definidas
      if (!itemStartDate || !itemEndDate) {
        itemStartDate = new Date(currentDate);

        // Crear fecha de finalización dos meses después
        const twoMonthsLater = new Date(currentDate);
        twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
        itemEndDate = twoMonthsLater;
      }

      // Calcular duración en milisegundos (para Google Charts)
      itemDuration = itemEndDate.getTime() - itemStartDate.getTime();

      // Calcular progreso basado en el tiempo transcurrido solo si no se definió por status
      if (itemProgress === 0) {
        if (currentDate < itemStartDate) {
          itemProgress = 0;
        } else if (currentDate > itemEndDate) {
          itemProgress = 100;
        } else {
          const totalDuration = itemEndDate.getTime() - itemStartDate.getTime();
          const elapsedDuration = currentDate.getTime() - itemStartDate.getTime();
          itemProgress = Math.round((elapsedDuration / totalDuration) * 100);
        }
      }

      // Actualizar fechas mínimas y máximas del grupo
      if (!groupStartDates.has(groupId) || itemStartDate < groupStartDates.get(groupId)) {
        groupStartDates.set(groupId, itemStartDate);
      }
      if (!groupEndDates.has(groupId) || itemEndDate > groupEndDates.get(groupId)) {
        groupEndDates.set(groupId, itemEndDate);
      }

      // Guardar el ítem procesado
      processedItems.get(groupId).push({
        id: item.id,
        name: item.name,
        resource: itemResource,
        startDate: itemStartDate,
        endDate: itemEndDate,
        duration: itemDuration,
        progress: itemProgress,
        dependency: groupId  // La dependencia es el grupo al que pertenece
      });
    }
  }

  // Construir las filas en orden: primero grupos, luego sus ítems
  for (const [groupId, group] of groups.entries()) {
    // Obtener las fechas del grupo, o usar fechas predeterminadas si no hay
    let groupStartDate = groupStartDates.get(groupId);
    let groupEndDate = groupEndDates.get(groupId);
    let groupDuration = null;

    // Si el grupo no tiene fechas definidas (no tiene elementos con fechas),
    // asignar fechas predeterminadas
    if (!groupStartDate || !groupEndDate) {
      groupStartDate = new Date(currentDate);
      const twoMonthsLater = new Date(currentDate);
      twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
      groupEndDate = twoMonthsLater;
    }

    // Calcular duración solo si ambas fechas son válidas
    if (groupStartDate && groupEndDate) {
      groupDuration = groupEndDate.getTime() - groupStartDate.getTime();
    }

    // Agregar el grupo como una fila, asegurándose de que siempre tenga fechas válidas
    chartRows.push([
      groupId,             // Task ID
      group.name,          // Task Name
      null,                // Resource (null para grupos)
      groupStartDate,      // Start Date (ahora siempre tiene un valor)
      groupEndDate,        // End Date (ahora siempre tiene un valor)
      groupDuration,       // Duration
      100,                 // Percent Complete (asumimos 100% para grupos)
      null                 // Dependencies (grupos no tienen dependencias)
    ]);

    // Agregar los ítems de este grupo
    const items = processedItems.get(groupId) || [];
    for (const item of items) {
      // Verificar que las fechas sean válidas, de lo contrario usar las del grupo
      const itemStartDate = item.startDate || groupStartDate;
      const itemEndDate = item.endDate || groupEndDate;
      const itemDuration = item.duration || groupDuration;

      chartRows.push([
        item.id,           // Task ID
        item.name,         // Task Name
        item.resource,     // Resource
        itemStartDate,     // Start Date (garantizado válido)
        itemEndDate,       // End Date (garantizado válido)
        itemDuration,      // Duration
        item.progress,     // Percent Complete
        item.dependency    // Dependencies (el ID del grupo al que pertenece)
      ]);
    }
  }

  // Verificar que todos los elementos tengan fechas válidas
  // independientemente del nombre del grupo
  for (let i = 0; i < chartRows.length; i++) {
    const row = chartRows[i];

    // Si cualquier elemento tiene fechas null, asignar fechas predeterminadas
    if (row[3] === null || row[4] === null) {
      // Asignar fechas válidas
      const defaultStartDate = new Date(currentDate);
      const defaultEndDate = new Date(currentDate);
      defaultEndDate.setMonth(defaultEndDate.getMonth() + 2);

      // Reemplazar fechas null con valores predeterminados
      row[3] = defaultStartDate;
      row[4] = defaultEndDate;
      row[5] = defaultEndDate.getTime() - defaultStartDate.getTime();
    }
  }

  // Retornar el formato exacto que requiere Google Charts
  return [chartColumns, ...chartRows];
}

export function formatDate(date: Date): string
{
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}