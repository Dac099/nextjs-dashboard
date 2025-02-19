export type Group = {id: string, name: string, color: string, position: number}
export type Column = {id: string, name: string, type: string, position: number}

export type Groups = Map<string, Group>;

export type Columns = Map<string, Column>;

export type ColumnsGroups = {
    groups: Groups;
    columns: Columns;
};
  
export type ColumnsGroupsDB = {
    groupId: string;
    groupName: string;
    groupColor: string;
    groupPosition: number;
    columnId: string;
    columnName: string;
    columnType: string;
    columnPosition: number;
};

export type Item = {
    id: string;
    name: string;
    groupId: string;
    position: number;
};

export type GroupItem = Map<string, Item[]>;

export type TableValue = {
    id: string;
    itemId: string;
    groupId: string;
    value: string;
};

export type ItemValues = Map<string, TableValue[]>;

export type BoardData = {
    columns: Columns;
    groups: Groups;
    itemsByGroup: GroupItem;
    valuesByItem: ItemValues;
};