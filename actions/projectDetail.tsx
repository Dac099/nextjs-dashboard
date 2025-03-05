'use server';
import connection from "@/services/database";
import {revalidatePath} from "next/cache";
import { faker } from '@faker-js/faker';
import {Item} from "@/utils/types/projectDetail";
import {groupItemsByType} from "@/utils/helpers";

export async function addGroupToBillingBoard(name: string): Promise<string> {
    await connection.connect();
    const billingBoard = '7B751882-33C5-44EC-A8CB-67EC93D46653';
    const colorGroup: string = faker.color.rgb();

    const selectQuery: string = `
        SELECT id  FROM Groups WHERE name = @name AND deleted_at IS NULL;
    `;

    const selectResult = await connection.request().input('name', name).query(selectQuery);

    if(selectResult.recordset.length > 0) return selectResult.recordset[0].id;

    const insertQuery: string = `
        INSERT INTO Groups (name, board_id, color, position)
        OUTPUT inserted.id
        VALUES (@name, @boardId, @color, (
            SELECT ISNULL(MAX(position), 0) + 1
            FROM Groups
            WHERE board_id = @boardId AND deleted_at IS NULL
        ));
    `;

    const insertResult = await connection
        .request()
        .input('name', name)
        .input('boardId', billingBoard)
        .input('color', colorGroup)
        .query(insertQuery);

    revalidatePath(`/board/7B751882-33C5-44EC-A8CB-67EC93D46653/view/D0D74A90-1098-4E7E-A09B-D6DCD2F26179`);
    return insertResult.recordset[0].id
}

export async function addItemToGroup(groupId: string): Promise<string>
{
    await connection.connect();

    const insertQuery: string = `
        INSERT INTO Items (group_id, name, position)
        OUTPUT inserted.id
        VALUES (@groupId, @name, (
            SELECT ISNULL(MAX(position), 0) + 1
            FROM Items
            WHERE group_id = @groupId AND deleted_at IS NULL
        ))
    `;

    const result = await connection
        .request()
        .input('groupId', groupId)
        .input('name', 'Sin nombre')
        .query(insertQuery);

    return result.recordset[0].id;
}

export async function getItemsForBilling(groupId: string): Promise<Item[]>{
    await connection.connect();
    const getDataQuery: string = `
        SELECT
            tv.value,
            c.name as columnName,
            i.name as itemName,
            i.id as itemId
        FROM TableValues tv
        LEFT JOIN Columns c ON tv.column_id = c.id
        LEFT JOIN Items i ON i.id = tv.item_id
        WHERE i.group_id = @groupId AND tv.deleted_at IS NULL;
    `;

    const result = await connection
        .request()
        .input('groupId', groupId)
        .query(getDataQuery);

    return groupItemsByType(result.recordset);
}