'use server';
import connection from "@/services/database";
import { revalidatePath } from "next/cache";
import { faker } from '@faker-js/faker';
import { Item } from "@/utils/types/projectDetail";
import { groupItemsByType } from "@/utils/helpers";
import { ResponseChat, Response as ResponseItem } from '@/utils/types/items';

export async function addGroupToBillingBoard(name: string): Promise<string> {
    await connection.connect();
    const billingBoard = '7B751882-33C5-44EC-A8CB-67EC93D46653';
    const colorGroup: string = faker.color.rgb();

    const selectQuery: string = `
        SELECT id  FROM Groups WHERE name = @name AND deleted_at IS NULL;
    `;

    const selectResult = await connection.request().input('name', name).query(selectQuery);

    if (selectResult.recordset.length > 0) return selectResult.recordset[0].id;

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

export async function addItemToGroup(groupId: string): Promise<string> {
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

export async function getItemsForBilling(groupId: string): Promise<Item[]> {
    await connection.connect();
    const getDataQuery: string = `
        SELECT 
            i.id as itemId,
            i.name as itemName,
            tv.value,
            c.name as columnName
        FROM Items i
        LEFT JOIN TableValues tv ON tv.item_id = i.id
        LEFT JOIN Columns c on c.id = tv.column_id
        WHERE i.group_id = @groupId 
            AND tv.deleted_at IS NULL
            AND i.deleted_at IS NULL
            AND c.deleted_at IS NULL
        ORDER BY i.created_at ASC, i.position ASC
    `;

    const result = await connection
        .request()
        .input('groupId', groupId)
        .query(getDataQuery);

    console.log(result.recordset)

    return groupItemsByType(result.recordset);
}

export async function addItemChat(entry: ResponseChat, itemId: string): Promise<void> {
    try {
        await connection.connect();
        const insertQuery: string = `
            INSERT INTO Chats (id, item_id, message, created_by, responses, tasks)
            VALUES (@id, @itemId, @message, @createdBy, @responses, @tasks);
        `;
        const result = await connection
            .request()
            .input('id', entry.id)
            .input('itemId', itemId)
            .input('message', entry.message)
            .input('createdBy', JSON.stringify(entry.author))
            .input('responses', JSON.stringify(entry.responses))
            .input('tasks', JSON.stringify(entry.tasks))
            .query(insertQuery);

        console.log(result);
    } catch {
        throw new Error('Ocurrió un error al crear el chat');
    }
}

export async function getItemChats(itemId: string): Promise<ResponseChat[]> {
    try {
        await connection.connect();
        const selectQuery: string = `
            SELECT 
                id,
                message,
                created_by as author,
                responses,
                tasks
            FROM Chats
            WHERE item_id = @itemId AND deleted_at IS NULL
            ORDER BY created_at DESC;
        `;

        const result = await connection
            .request()
            .input('itemId', itemId)
            .query(selectQuery);

        return result.recordset.map(chat => ({
            id: chat.id,
            message: chat.message,
            author: JSON.parse(chat.author),
            responses: JSON.parse(chat.responses),
            tasks: JSON.parse(chat.tasks)
        } as ResponseChat));
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw new Error('Ocurrió un error al obtener los chats');
    }
}

export async function addChatResponse(chatId: string, responses: ResponseItem[]): Promise<void> {
    try {
        await connection.connect();
        const insertQuery: string = `
            UPDATE Chats
            SET responses = @responses
            WHERE id = @chatId;
        `;

        await connection
            .request()
            .input('chatId', chatId)
            .input('responses', JSON.stringify(responses))
            .query(insertQuery);

    } catch (error) {
        console.error('Error adding chat response:', error);
        throw new Error('Ocurrió un error al agregar la respuesta al chat');
    }
}

export async function updateChat(newChat: ResponseChat): Promise<void> {
    try {
        await connection.connect();
        const updateQuery: string = `
            UPDATE Chats
            SET message = @message,
                tasks = @tasks,
                updated_at = GETDATE()
            WHERE id = @chatId;
        `;

        await connection
            .request()
            .input('chatId', newChat.id)
            .input('message', newChat.message)
            .input('tasks', JSON.stringify(newChat.tasks))
            .query(updateQuery);
    } catch {
        throw new Error('Ocurrió un error al actualizar el chat');
    }
}
