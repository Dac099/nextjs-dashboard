export type Item = {
    id?: string;
    name: string;
    total: number;
    invoice: number;
    paymentDate: Value;
    paid: number;
    invoiceNumber: string;
    status: Tag;
    lastUpdate: Value;
}

export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type Tag = {
    color: string;
    text: string;
};

export type ValueDB = {
    itemId: string;
    columnName: string;
    value: string;
    itemName: string;
};

export type QuoteItem = {
    id: number;
    quote: string;
    revision: string;
    clientName: string;
    clientId: string;
    proyectName: string;
    machineBudget: number;
    mechanicalBudget: number;
    electricalBudget: number;
    specialComponentsBudget: number;
    mechanicalDesignTime: number;
    electricalDesignTime: number;
    assemblyTime: number;
    otherTime: number; 
    developmentTime: number;
    definedWeeks: number;
    poDate: string;
    createdAt: string;
    notes: string;
    status: string;
    totalBudget: number;
};

export type MachineData = {
    serialNumber: string;
    mechanicalBudget: number;
    electricalBudget: number;
    machineBudget: number;
    otherBudget: number;
    mechanicalDesignTime: number;
    electricalDesignTime: number;
    assemblyTime: number;
    otherTime: number;
    developmentTime: number;
    projectManager: string;
    mechanicalDesigner: string;
    electricalDesigner: string;
    developer: string;
    assembler: string;
};

export type ProjectFormData = {
    typeCreated: 'manual' | 'automatic';
    projectFolio: string;
    typeProject: string;
    jobsQuantity: number;
    equalDates: boolean;
    projectName: string;
    projectDescription: string;
    poClient: string;
    sector: string;
    poDate: string;
    deadline: string;
    proposedWeeks: number; 
    kickOffDate: string;
    currency: string;
    totalBudget: number;
    linkDrive: string;
    machines: MachineData[];
    status: string;
    notes: string;
    billNumber: string;
    quoteItem: QuoteItem | null;
    projectManagerId: string;
    mechanicalDesignerId: string;
    electricalDesignerId: string;
    developerId: string;
    assemblerId: string;
    mechanicalBudget: number;
    electricalBudget: number;
    machineBudget: number;
    otherBudget: number;
    mechanicalDesignTime: number;
    electricalDesignTime: number;
    assemblyTime: number;
    otherTime: number;
    developmentTime: number;
};

export type ProjectType = {
    id: string;
    prefix: string; 
    title: string; 
    description: string;
    initialCounter: number;
    currentCounter: number;    
}

export type OCQuote = {
    id: number; 
    ocNumber: number;
    quoteId: string;
    poClient: string;
    poDate: string;
    pathUrl: string;
};

export type SectorItem = {
    id: string; 
    name: string;
};

export type Currency = {
    id: string;
    name: string;
}

export type MachineDB = {
    serialNumber: string; 
    detail: string; 
    title: string;
    owner: string; 
    description: string;
    clientName: string; 
    field: string;
    clientId: string;
    projectId: string;
};

export type EmployeeField = {
    userId: string;
    username: string;
    employeeField: string;
};

export type FieldWithEmployees = { [key: string]: {username: string; userId: string}[] };

export type FilteredEmployee = {
    id: string;
    name: string;
    department: string;
    position: string;
    assignedItems: {itemId: string; itemName: string}[];
};

export type FilteredEmployeeWithItems = {
    id: string;
    name: string;
    department: string;
    position: string;
    itemIds: string;
    itemNames: string;
}

export type userAsignedToItem = {
    id: string;
    name: string;
    department: string;
    position: string;
    asignedDate: string;
    asignedBy: string;
};