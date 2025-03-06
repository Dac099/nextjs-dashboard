/**
 * Generates the SQL query to insert items in batch by the groupId. It only inserts items that does not have relation
 * with any project, and the items do not have any value either. Usually invoke this function when create a duplicate
 * of one group.
 *
 * @param {Array<{name: string, position: number}>} items Array with all the items to insert in the group.
 * @param {string} groupId ID of the group to insert the items
 * @return {string} The string of the SQL query to use in connection's query method
 * */
export function buildInsertItemsBatchQuery(items: {name: string, position: number}[], groupId: string): string{
    const baseQuery: string = `
        INSERT INTO Items (group_id, name, position)
        VALUES
    `;

    const reducer = (
        acc: string,
        item: {name: string, position: number},
        index: number
    ): string => {
        let valueString = `('${groupId}', '${item.name.replace(/'/g, "''")}', ${item.position})`;

        if(index < items.length - 1){
            valueString += ',';
        }

        return acc + '\n        ' + valueString;
    }

    return items.reduce(reducer, baseQuery) + ';';
}