export type Permission = {
  workspace: string;
  actions: Actions[];
  boards: string[];
};

export type Role = {
  name: string;
  description: string;
  permissions: Permission[];
};

export type Actions = 'read' | 'create' | 'update';