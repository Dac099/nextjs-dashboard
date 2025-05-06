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

export type SessionData = {
  id: string;
  username: string;
  role: string,
  isLoggedIn: boolean
};

export type Actions = 'read' | 'create' | 'update';
