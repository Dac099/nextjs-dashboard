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