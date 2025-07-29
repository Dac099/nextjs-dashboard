export const OPERATIONS_BY_COLUMN: Record<
  string,
  { label: string; value: string; icon: string }[]
> = {
  rfq_type: [{ label: "Igual a", value: "equals", icon: "pi pi-equals" }],
  general_state: [{ label: "Igual a", value: "equals", icon: "pi pi-equals" }],
  rfq_state: [{ label: "Igual a", value: "equals", icon: "pi pi-equals" }],
  created_date: [
    { label: "Igual a", value: "equals", icon: "pi pi-equals" },
    { label: "Mayor que", value: "greater", icon: "pi pi-angle-right" },
    { label: "Menor que", value: "less", icon: "pi pi-angle-left" },
    { label: "Entre", value: "between", icon: "pi pi-arrows-h" },
  ],
  machine_type: [{ label: "Igual a", value: "equals", icon: "pi pi-equals" }],
  article_state: [{ label: "Igual a", value: "equals", icon: "pi pi-equals" }],
  po_date: [
    { label: "Igual a", value: "equals", icon: "pi pi-equals" },
    { label: "Mayor que", value: "greater", icon: "pi pi-angle-right" },
    { label: "Menor que", value: "less", icon: "pi pi-angle-left" },
    { label: "Entre", value: "between", icon: "pi pi-arrows-h" },
  ],
  promise_date: [
    { label: "Igual a", value: "equals", icon: "pi pi-equals" },
    { label: "Mayor que", value: "greater", icon: "pi pi-angle-right" },
    { label: "Menor que", value: "less", icon: "pi pi-angle-left" },
    { label: "Entre", value: "between", icon: "pi pi-arrows-h" },
  ],
  reception_date: [
    { label: "Igual a", value: "equals", icon: "pi pi-equals" },
    { label: "Mayor que", value: "greater", icon: "pi pi-angle-right" },
    { label: "Menor que", value: "less", icon: "pi pi-angle-left" },
    { label: "Entre", value: "between", icon: "pi pi-arrows-h" },
  ],
};

export const COLUMNS_TYPES = {
  rfq_type: "string",
  general_state: "string",
  rfq_state: "string",
  created_date: "date",
  machine_type: "string",
  article_state: "string",
  po_date: "date",
  promise_date: "date",
  reception_date: "date",
};