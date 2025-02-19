export type Workspace = {
  id: string;
  name: string;
  boardId: string;
  boardName: string;
};

export type Dashboard = {
  workspaceId: string;
  workspaceName: string;
  boardId: string;
  boardName: string;
};

export type WorkspaceWithDashboards = {
  [key: string] : Dashboard[]
}