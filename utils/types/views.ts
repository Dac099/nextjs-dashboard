export type ViewDB = {
    id: string;
    name: string;
    type: string;
    is_default: boolean;
};

export type ViewSettings = {
    id: string;
    setting_key: string;
    setting_value: string;
};

export type ViewWithSettings = {
    view: ViewDB;
    settings: ViewSettings[];
};

export type ItemValue = {
    id: string;
    itemId: string;
    columnId: string;
    value: string;
};

export type ItemData = {
    id: string;
    groupId: string;
    projectId: string | null | undefined;
    name: string;
    position: number; 
    values: ItemValue[];
};

export type SubItemData = {
    id: string;
    name: string;
    itemParentId: string;
    values: ItemValue[];
};

export type GroupData = {
    id: string;
    name: string;
    position: number;
    color: string;
    items: ItemData[];
};

export type ColumnData = {
    id: string;
    name: string;
    type: 'text' | 'number' | 'status' | 'date' | 'timeline' | 'percentage';
    postion: number;
};
