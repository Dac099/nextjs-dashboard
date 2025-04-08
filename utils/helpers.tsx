import {Item, ValueDB} from "@/utils/types/projectDetail";
import { SubItem, TableValue } from './types/groups';

export function formatDate(date: Date): string
{
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export function groupItemsByType(data: ValueDB[]): Item[]
{
  const groupedByItemId: Record<string, Partial<Item>> = {};

  data.forEach(item => {
    const { itemId, columnName, value, itemName } = item;

    if (!groupedByItemId[itemId]) {
      groupedByItemId[itemId] = {
        id: itemId,
        name: itemName,
      };
    }

    switch (columnName) {
      case 'Total':
        groupedByItemId[itemId].total = parseFloat(JSON.parse(value));
        break;
      case 'Invoice':
        groupedByItemId[itemId].invoice = parseFloat(JSON.parse(value));
        break;
      case 'Payment date':
        const paymentDateClean = JSON.parse(value);
        groupedByItemId[itemId].paymentDate = new Date(paymentDateClean);
        break;
      case 'Paid':
        groupedByItemId[itemId].paid = parseFloat(JSON.parse(value));
        break;
      case 'Invoice number':
        groupedByItemId[itemId].invoiceNumber = JSON.parse(value);
        break;
      case 'Status':
        try {
          groupedByItemId[itemId].status = JSON.parse(value);
        } catch (e) {
          console.error(`Error al parsear status para el item ${itemId}:`, e);
          groupedByItemId[itemId].status = { color: '', text: '' };
        }
        break;
      case 'Last Updated':
        const lastUpdateClean = JSON.parse(value);
        groupedByItemId[itemId].lastUpdate = new Date(lastUpdateClean);
        break;
      default:
        console.warn(`Columna no reconocida: ${columnName} para el item ${itemId}`);
        break;
    }
  });

  return Object.values(groupedByItemId).map(item => {
    return {
      id: item.id,
      name: item.name || 'Sin nombre',
      total: item.total || 0,
      invoice: item.invoice || 0,
      paymentDate: item.paymentDate || new Date(),
      paid: item.paid || 0,
      invoiceNumber: item.invoiceNumber || '',
      status: item.status || { color: '', text: '' },
      lastUpdate: item.lastUpdate || new Date(),
    } as Item;
  });
}
export function subItemValueByColumnId(columnId: string, subItem: SubItem): TableValue
{
  const tableValue = subItem
    .values
    .find((value) => value && value.columnId === columnId) as TableValue;

  return tableValue ?? {
    id: '',
    itemId: subItem.id,
    columnId: columnId,
    value: '',
    groupId: ''
  };
}

export function findParentKeyBySubItemId(
  subItemsMap: Map<string, SubItem[]>,
  subItemId: string
): string | null {
  for (const [key, subItems] of subItemsMap) {
    if (subItems.some(subItem => subItem.id === subItemId)) {
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
      if (subItem.values.some(value => value.id === valueId)) {
        return key;
      }
    }
  }
  return null;
}