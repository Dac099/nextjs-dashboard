'use server';
import connection from "@/services/database";
import { faker } from '@faker-js/faker'
import {revalidatePath} from "next/cache";
import {Group} from "@/utils/types/groups";

export async function addGroup(boardId: string, name: string, viewId: string): Promise<void>
{
  await connection.connect();
  const query: string = `
    INSERT INTO Groups (board_id, name, position, color)
    VALUES (@boardId, @name, 0, @color)
  `;
  await connection
      .request()
      .input('boardId', boardId)
      .input('name', name)
      .input('color', faker.color.rgb())
      .query(query);

  revalidatePath(`/board/${boardId}/view/${viewId}`);
}

export async function getAllGroups(boardId: string): Promise<Group[]>
{
  await connection.connect();
  const query: string = `
    SELECT 
        id,
        name, 
        color,
    FROM Groups 
    ORDER BY position
    WHERE deleted_at IS NOT NULL AND board_id = @boardId
  `;

  const result = await connection
      .request()
      .input('boardId', boardId)
      .query(query);

  return result.recordset;
}

export async function getColumns(boardId: string): Promise