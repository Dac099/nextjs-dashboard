import { Item, ProjectFormData, ValueDB } from "@/utils/types/projectDetail";
import { SubItem, TableValue } from "./types/groups";
import { Task } from "./types/items";
import { v4 as uuidV4 } from "uuid";
import { ItemValue } from './types/views';

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function groupItemsByType(data: ValueDB[]): Item[] {
  const groupedByItemId: Record<string, Partial<Item>> = {};

  data.forEach((item) => {
    const { itemId, columnName, value, itemName } = item;

    if (!groupedByItemId[itemId]) {
      groupedByItemId[itemId] = {
        id: itemId,
        name: itemName,
      };
    }

    switch (columnName) {
      case "Total":
        groupedByItemId[itemId].total = parseFloat(JSON.parse(value));
        break;
      case "Invoice":
        groupedByItemId[itemId].invoice = parseFloat(JSON.parse(value));
        break;
      case "Payment date":
        const paymentDateClean = JSON.parse(value);
        groupedByItemId[itemId].paymentDate = new Date(paymentDateClean);
        break;
      case "Paid":
        groupedByItemId[itemId].paid = parseFloat(JSON.parse(value));
        break;
      case "Invoice number":
        groupedByItemId[itemId].invoiceNumber = JSON.parse(value);
        break;
      case "Status":
      case "Status PM":
        try {
          groupedByItemId[itemId].status = JSON.parse(value);
        } catch (e) {
          console.error(`Error al parsear status para el item ${itemId}:`, e);
          groupedByItemId[itemId].status = { color: "", text: "" };
        }
        break;
      case "Last Updated":
        const lastUpdateClean = JSON.parse(value);
        groupedByItemId[itemId].lastUpdate = new Date(lastUpdateClean);
        break;
      default:
        console.warn(
          `Columna no reconocida: ${columnName} para el item ${itemId}`
        );
        break;
    }
  });

  return Object.values(groupedByItemId).map((item) => {
    return {
      id: item.id,
      name: item.name || "Sin nombre",
      total: item.total || 0,
      invoice: item.invoice || 0,
      paymentDate: item.paymentDate || new Date(),
      paid: item.paid || 0,
      invoiceNumber: item.invoiceNumber || "",
      status: item.status || { color: "", text: "" },
      lastUpdate: item.lastUpdate || new Date(),
    } as Item;
  });
}
export function subItemValueByColumnId(
  columnId: string,
  subItem: SubItem
): TableValue {
  const tableValue = subItem.values.find(
    (value) => value && value.columnId === columnId
  ) as TableValue;

  return (
    tableValue ?? {
      id: "",
      itemId: subItem.id,
      columnId: columnId,
      value: "",
      groupId: "",
    }
  );
}

export function findParentKeyBySubItemId(
  subItemsMap: Map<string, SubItem[]>,
  subItemId: string
): string | null {
  for (const [key, subItems] of subItemsMap) {
    if (subItems.some((subItem) => subItem.id === subItemId)) {
      return key;
    }
  }
  return null;
}

export function findParentKeyByValueId(
  subItemsMap: Map<string, SubItem[]>,
  valueId: string
): string | null {
  for (const [key, subItems] of subItemsMap) {
    for (const subItem of subItems) {
      if (subItem.values.some((value) => value.id === valueId)) {
        return key;
      }
    }
  }
  return null;
}

export function extractTasksFromHTML(htmlString: string): Task[] {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const taskItems = tempDiv.querySelectorAll('li[data-type="taskItem"]');

  const tasks = Array.from(taskItems).map((item) => {
    const completed = item.getAttribute("data-checked") === "true";
    const message = item.querySelector("div p")?.textContent || "";
    const id = uuidV4();

    return {
      id,
      message,
      completed,
    };
  });

  return tasks;
}

export function getDateSQLFormat() {
  const now = new Date();

  // Formato YYYY-MM-DD HH:MM:SS.mmm
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function validateProjectFormData(
  projectData: ProjectFormData
): string[] {
  const errors: string[] = [];

  if (!projectData.projectFolio) {
    errors.push("Se requiere folio de proyecto");
  }

  if (!projectData.poClient) {
    errors.push("Se requiere PO de cliente");
  }

  if (!projectData.projectName) {
    errors.push("Se requiere nombre de proyecto");
  }

  if (!projectData.quoteItem?.quote) {
    errors.push("Se requiere número de cotización");
  }

  if (projectData.totalBudget < 0) {
    errors.push("Presupuesto total debe ser mayor a 0");
  }

  if (!projectData.currency) {
    errors.push("Se requiere moneda");
  }

  if (!projectData.sector) {
    errors.push("Se requiere sector");
  }

  if (!projectData.status) {
    errors.push("Se requiere estatus");
  }

  if (
    !projectData.projectManagerId ||
    !projectData.assemblerId ||
    !projectData.electricalDesignerId ||
    !projectData.mechanicalDesignerId
  ) {
    errors.push("No se definieron todos los responsables");
  }

  if (!projectData.poDate) {
    errors.push("Se requiere fecha de PO");
  }

  if (!projectData.deadline) {
    errors.push("Se requiere fecha fin");
  }

  if (!projectData.kickOffDate) {
    errors.push("Se requiere fecha de kickoff");
  }

  if (!projectData.proposedWeeks) {
    errors.push("Se requiere semanas propuestas");
  }

  return errors;
}

export function validateProjectBudgetAndTime(
  projectData: ProjectFormData
): ProjectFormData {
  // Inicializar valores predeterminados para evitar NaN si alguno es undefined
  const otherBudget = projectData.otherBudget || 0;
  const mechanicalBudget = projectData.mechanicalBudget || 0;
  const machineBudget = projectData.machineBudget || 0;
  const electricalBudget = projectData.electricalBudget || 0;

  // Si no hay máquinas, calculamos el presupuesto total directamente de los campos del proyecto
  if (projectData.machines.length === 0) {
    const updatedData: ProjectFormData = {
      ...projectData,
      otherBudget,
      mechanicalBudget,
      machineBudget,
      electricalBudget,
      totalBudget:
        otherBudget + mechanicalBudget + machineBudget + electricalBudget,
    };

    return updatedData;
  }

  // Si hay máquinas, calculamos los presupuestos y tiempos sumando los valores de todas las máquinas
  const calculatedMachineBudget = projectData.machines.reduce(
    (acc, machine) => acc + (machine.machineBudget || 0),
    0
  );
  const calculatedElectricalBudget = projectData.machines.reduce(
    (acc, machine) => acc + (machine.electricalBudget || 0),
    0
  );
  const calculatedMechanicalBudget = projectData.machines.reduce(
    (acc, machine) => acc + (machine.mechanicalBudget || 0),
    0
  );
  const calculatedOtherBudget = projectData.machines.reduce(
    (acc, machine) => acc + (machine.otherBudget || 0),
    0
  );

  // Calculamos el presupuesto total sumando todos los presupuestos calculados
  const calculatedTotalBudget =
    calculatedMachineBudget +
    calculatedElectricalBudget +
    calculatedMechanicalBudget +
    calculatedOtherBudget;

  const updatedData: ProjectFormData = {
    ...projectData,
    machineBudget: calculatedMachineBudget,
    electricalBudget: calculatedElectricalBudget,
    mechanicalBudget: calculatedMechanicalBudget,
    otherBudget: calculatedOtherBudget,
    totalBudget: calculatedTotalBudget,
    otherTime: projectData.machines.reduce(
      (acc, machine) => acc + (machine.otherTime || 0),
      0
    ),
    electricalDesignTime: projectData.machines.reduce(
      (acc, machine) => acc + (machine.electricalDesignTime || 0),
      0
    ),
    mechanicalDesignTime: projectData.machines.reduce(
      (acc, machine) => acc + (machine.mechanicalDesignTime || 0),
      0
    ),
    assemblyTime: projectData.machines.reduce(
      (acc, machine) => acc + (machine.assemblyTime || 0),
      0
    ),
    developmentTime: projectData.machines.reduce(
      (acc, machine) => acc + (machine.developmentTime || 0),
      0
    ),
  };

  return updatedData;
}

export function calculatePercentageBetweenDates(dates: Date[]): number {
  if (dates.length < 2) {
    return 0; // No se puede calcular el porcentaje con menos de dos fechas
  }

  const startDate = dates[0].getTime();
  const endDate = dates[1].getTime();
  const currentDate = new Date().getTime();

  if (currentDate < startDate) {
    return 0; // La fecha actual no está dentro del rango
  }

  if (currentDate > endDate) {
    return 100; // La fecha actual está después del rango
  }

  const totalDuration = endDate - startDate;
  const elapsedDuration = currentDate - startDate;

  return Math.round((elapsedDuration / totalDuration) * 100);
}

export const formatTimeLineItemValue = (value: ItemValue | undefined): Date[] | null => {
  if (!value || !value.value) return null;

  try {
    const dates = JSON.parse(value.value) as Date[];
    return dates.map((date) => new Date(date));
  } catch (error) {
    console.error("Error parsing item value:", error);
    return null;
  }
};
