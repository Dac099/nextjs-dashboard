import { BoardData } from './types/groups';

/**
 * Convierte BoardData a un formato de datos específico para el gantt
 * con cálculo de progreso basado en fechas o columna específica
 */
export function formatBoardDataForGantt(boardData: BoardData) {
  const { groups, columns, itemsByGroup, valuesByItem } = boardData;
  const result = [];
  const currentDate = new Date();

  // Encontrar columnas de tipo Timeline y Progress (si existe)
  const timelineColumns = new Map();
  const progressColumns = new Map();
  for (const [columnId, column] of columns.entries()) {
    if (column.type === 'timeline') {
      timelineColumns.set(columnId, column);
    } 
    // Asumiendo que podrías tener una columna de tipo 'number' que represente el progreso
    else if (column.type === 'number' && column.name.toLowerCase().includes('progreso')) {
      progressColumns.set(columnId, column);
    }
  }

  // Procesar cada grupo
  for (const [groupId, group] of groups.entries()) {
    const items = itemsByGroup.get(groupId) || [];
    
    if (items.length === 0) {
      continue;
    }

    let groupStartDate = null;
    let groupEndDate = null;
    const subtasks = [];

    // Procesar cada item del grupo
    for (const item of items) {
      const itemValues = valuesByItem.get(item.id) || [];
      
      let itemStartDate = null;
      let itemEndDate = null;
      let itemDuration = 0;
      let itemProgress = 0; // Inicializar progreso
      let progressFound = false;

      // Primero buscar valores de timeline
      for (const value of itemValues) {
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
      }

      // Después buscar explícitamente el valor de progreso
      for (const value of itemValues) {
        if (progressColumns.has(value.columnId) && value.value) {
          try {
            // Si la columna es de tipo número y contiene progreso
            const progressValue = parseFloat(value.value);
            if (!isNaN(progressValue)) {
              itemProgress = progressValue;
              progressFound = true;
              break;
            }
          } catch (e) {
            console.error(`Error parsing progress value for item ${item.id}:`, e);
          }
        }
      }

      // Si no encontramos un valor explícito de progreso, calcularlo basado en fechas
      if (!progressFound && itemStartDate && itemEndDate) {
        // Calcular progreso basado en la fecha actual en relación a la duración total
        if (currentDate < itemStartDate) {
          // La tarea aún no ha comenzado
          itemProgress = 0;
        } else if (currentDate > itemEndDate) {
          // La tarea ya ha terminado
          itemProgress = 100;
        } else {
          // La tarea está en progreso
          const totalDuration = itemEndDate.getTime() - itemStartDate.getTime();
          const elapsedDuration = currentDate.getTime() - itemStartDate.getTime();
          itemProgress = Math.round((elapsedDuration / totalDuration) * 100);
        }
      }

      // Calcular duración en días
      if (itemStartDate && itemEndDate) {
        const diffTime = Math.abs(itemEndDate.getTime() - itemStartDate.getTime());
        itemDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      // Actualizar las fechas del grupo
      if (itemStartDate && (!groupStartDate || itemStartDate < groupStartDate)) {
        groupStartDate = itemStartDate;
      }
      if (itemEndDate && (!groupEndDate || itemEndDate > groupEndDate)) {
        groupEndDate = itemEndDate;
      }

      // Crear el objeto de subtask
      subtasks.push({
        TaskID: item.id,
        TaskName: item.name,
        StartDate: itemStartDate,
        EndDate: itemEndDate,
        Duration: itemDuration,
        Progress: itemProgress
      });
    }

    // Crear el objeto de grupo
    result.push({
      TaskID: groupId,
      TaskName: group.name,
      StartDate: groupStartDate,
      EndDate: groupEndDate,
      subtasks: subtasks
    });
  }

  return result;
}