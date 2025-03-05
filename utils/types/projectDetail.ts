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