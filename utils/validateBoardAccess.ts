import { redirect } from "next/navigation";
import { verifySession } from "@/utils/dal";
import { ROLES } from "@/utils/roleDefinition";
import { getViewType, getWorkspaceAndBoardData } from "@/actions/boards";

/**
 * Validates user access to a board view and returns allowed user actions
 * @param boardId The ID of the board to validate access for
 * @param viewId The ID of the view to validate access for
 * @returns The allowed user actions for the authenticated user
 */
export async function validateBoardAccess(boardId: string, viewId: string) {
  const result = await getWorkspaceAndBoardData(boardId);
  
  if (!result || result.length === 0) {
    redirect("/not-found");
  }
  
  const { workspaceName, boardName } = result;
  const { role } = await verifySession();
  const userWorkspace = ROLES[role].permissions.find(
    (permission) => permission.workspace === workspaceName
  );
  
  if (
    !userWorkspace ||
    (!userWorkspace.boards.includes(boardName) &&
    !userWorkspace.boards.includes("*"))
  ) {
    redirect("/");
  }
  
  const viewType: string = await getViewType(viewId);
  if (!viewType) {
    redirect("/not-found");
  }
  
  return {
    allowedUserActions: userWorkspace.actions,
    viewType
  };
}
