'use server';
import connection from '@/services/database';
import { SubItem } from '@/utils/types/groups';
import type { Item, ProjectData, Column } from '@/utils/types/items';
import { revalidatePath } from 'next/cache';

export async function updateItemName(itemId: string, itemName: string): Promise<void> {
  await connection.connect();
  const query: string = `
    UPDATE Items
    SET name = @name, updated_at = GETDATE()
    WHERE id = @itemId
  `;

  await connection
    .request()
    .input('name', itemName)
    .input('itemId', itemId)
    .query(query);
}

export async function getProjectData(projectId: string): Promise<ProjectData[]> {
  await connection.connect();
  const query: string = `
    SELECT 
        tp.id_proyect as id,
        tc.nom_cliente as client,
        tu.nom_user as created_by,
        tpt.nom_tipo as type,
        tee.nom_estado as state,
        tmd.nombre as division,
        tp.nom_proyecto as name,
        tp.desc_proyecto as description,
        tp.presupuesto_inicial as initial_budget,
        tp.id_moneda as currency,
        tp.fecha_inicio as beginning_date,
        tp.fecha_fin as end_date, 
        tp.fecha_registro as created_at, 
        tp.nota as note,
        tp.num_serie,
        tp.num_oc, 
        tp.num_cot,
        tp.num_factura as num_fac,
        tp.presupuesto_meca as mechanical_budget,
        tp.presupuesto_maqui as machine_budget,
        tp.presupuesto_elect as electrical_budget,
        tp.presupuesto_otro as other_budget,
        tp.cantidad_jobs as jobs_count, 
        tp.horas_diseño_mecanico as mechanical_design_hours,
        tp.horas_diseño_electrico as electrical_design_hours,
        tp.horas_ensamble_programacion as assembly_dev_hours,
        tp.horas_programacion as programming_hours,
        tp.horas_otros as other_hours, 
        tp.fecha_kickoff as kickoff,
        tp.semanas_propuestas as weeks_count,
        tp.responsable_project_manager as project_manager,
        tp.responsable_diseñador_mecanico as mechanical_designer,
        tp.responsable_diseñador_electrico as electrical_designer,
        tp.responsable_programador as developer,
        tp.responsable_ensamblador as assembler
    FROM tb_proyect tp
    LEFT JOIN tb_cliente tc ON tc.id_cliente = tp.id_cliente
    LEFT JOIN tb_user tu ON tu.id_user = tp.id_user
    LEFT JOIN tb_pro_tipo tpt ON tpt.id_tipo_pro = tp.id_tipo_pro
    LEFT JOIN tb_eq_estatus tee ON tee.id_estado = tp.id_estado
    LEFT JOIN tb_mach_div tmd ON tmd.id_div = tp.id_sector
    WHERE tp.id_proyect = @projectId
  `;

  const result = await connection
    .request()
    .input('projectId', projectId)
    .query(query);

  return result.recordset;
}

export async function getProjectDataByItem(itemId: string): Promise<ProjectData> {
  await connection.connect();
  const query: string = `
    SELECT 
        tp.id_proyect as id,
        tc.nom_cliente as client,
        tu.nom_user as created_by,
        tpt.nom_tipo as type,
        tee.nom_estado as state,
        tmd.nombre as division,
        tp.nom_proyecto as name,
        tp.desc_proyecto as description,
        tp.presupuesto_inicial as initial_budget,
        tp.id_moneda as currency,
        tp.fecha_inicio as beginning_date,
        tp.fecha_fin as end_date, 
        tp.fecha_registro as created_at, 
        tp.nota as note,
        tp.num_serie,
        tp.num_oc, 
        tp.num_cot,
        tp.num_factura as num_fac,
        tp.presupuesto_meca as mechanical_budget,
        tp.presupuesto_maqui as machine_budget,
        tp.presupuesto_elect as electrical_budget,
        tp.presupuesto_otro as other_budget,
        tp.cantidad_jobs as jobs_count, 
        tp.horas_diseño_mecanico as mechanical_design_hours,
        tp.horas_diseño_electrico as electrical_design_hours,
        tp.horas_ensamble_programacion as assembly_dev_hours,
        tp.horas_programacion as programming_hours,
        tp.horas_otros as other_hours, 
        tp.fecha_kickoff as kickoff,
        tp.semanas_propuestas as weeks_count,
        tp.responsable_project_manager as project_manager,
        tp.responsable_diseñador_mecanico as mechanical_designer,
        tp.responsable_diseñador_electrico as electrical_designer,
        tp.responsable_programador as developer,
        tp.responsable_ensamblador as assembler
    FROM Items it
    LEFT JOIN tb_proyect tp on it.project_id = tp.id_proyect
    LEFT JOIN tb_cliente tc ON tc.id_cliente = tp.id_cliente
    LEFT JOIN tb_user tu ON tu.id_user = tp.id_user
    LEFT JOIN tb_pro_tipo tpt ON tpt.id_tipo_pro = tp.id_tipo_pro
    LEFT JOIN tb_eq_estatus tee ON tee.id_estado = tp.id_estado
    LEFT JOIN tb_mach_div tmd ON tmd.id_div = tp.id_sector
    WHERE it.id = @itemId
  `;

  const result = await connection
    .request()
    .input('itemId', itemId)
    .query(query);

  return result.recordset[0];
}

export async function getItemDetail(itemId: string): Promise<Item[]> {
  await connection.connect()
  const query: string = `
    SELECT 
      name,
      created_at,
      updated_at, 
      project_id
    FROM Items
    WHERE id = @itemId
  `;
  const result = await connection
    .request()
    .input('itemId', itemId)
    .query(query);

  return result.recordset;
}

export async function getAllProjects(): Promise<{ id: string, name: string }[]> {
  await connection.connect()
  const query: string = `
    SELECT 
      tp.id_proyect as id,
      tp.nom_proyecto as name
    FROM tb_proyect tp
    WHERE tp.id_proyect NOT IN (
      SELECT project_id 
      FROM Items
      WHERE project_id IS NOT NULL
    )
  `;
  const result = await connection.query(query);

  return result.recordset;
}

export async function getBoardColumns(boardId: string): Promise<Column[]> {
  await connection.connect();
  const query: string = `
    SELECT 
      id,
      name,
      type,
      position
    FROM Columns
    WHERE board_id = @boardId
    ORDER BY position 
  `;

  const result = await connection
    .request()
    .input('boardId', boardId)
    .query(query);


  return result.recordset;
}

export async function addItemByProject(groupId: string, viewId: string, boardId: string, itemName: string, projectId: string): Promise<string> {
  const addItemQuery: string = `
  INSERT INTO Items (group_id, name, position, project_id)
  OUTPUT INSERTED.id
  VALUES (@groupId, @name,
      (SELECT ISNULL(MAX(position), 0) + 1 FROM Items 
      WHERE group_id = @groupId AND deleted_at IS NULL),
      @projectId
  )`;

  await connection.connect();
  const result = await connection
    .request()
    .input('groupId', groupId)
    .input('name', itemName)
    .input('projectId', projectId)
    .query(addItemQuery);

  revalidatePath(`board/${boardId}/view/${viewId}`);
  return result.recordset[0].id;
}

export async function getSubItems(itemId: string): Promise<SubItem[]> {
  await connection.connect();

  type QueryItem = {
    id: string;
    name: string;
    itemParent: string;
    valueId: string;
    columnId: string;
    value: string;
  };

  const query: string = `
    SELECT 
      si.id,
      si.name,
      si.item_parent as itemParent,
      tv.id as valueId,
      tv.column_id as columnId, 
      tv.value
    FROM TableValues tv
    RIGHT JOIN SubItems si ON tv.item_id = si.id
    WHERE si.item_parent = @itemId
    AND si.deleted_at IS NULL
    AND tv.deleted_at IS NULL
    ORDER BY si.created_at
  `;


  const result = await connection
    .request()
    .input('itemId', itemId)
    .query(query);

  return result.recordset.reduce((acc: SubItem[], itemData: QueryItem) => {
    const existingSubItem = acc.find(subItem => subItem.id === itemData.id);
    if (existingSubItem) {
      existingSubItem.values.push({
        id: itemData.valueId,
        value: itemData.value,
        columnId: itemData.columnId,
        itemId: itemData.id,
        groupId: ''
      });
    } else {
      acc.push({
        id: itemData.id,
        name: itemData.name,
        itemParent: itemData.itemParent,
        values: [{
          id: itemData.valueId,
          value: itemData.value,
          columnId: itemData.columnId,
          itemId: itemData.id,
          groupId: ''
        }]
      });
    }
    return acc;
  }, [] as SubItem[]);
}

export async function addSubItem(name: string, parentId: string): Promise<string> {
  await connection.connect();
  const query: string = `
    INSERT INTO SubItems (name, item_parent)
    OUTPUT INSERTED.id
    VALUES (@name, @parentId)
  `;

  const result = await connection
    .request()
    .input('name', name)
    .input('parentId', parentId)
    .query(query);

  return result.recordset[0].id;
}

export async function updateSubItemName(subItemId: string, newName: string): Promise<void> {
  await connection.connect();
  const query: string = `
    UPDATE SubItems
    SET 
      name = @name,
      updated_at = GETDATE()
    WHERE id = @subItemId
  `;

  await connection
    .request()
    .input('name', newName)
    .input('subItemId', subItemId)
    .query(query);
}

export async function deleteSubItem(subItemId: string, boardId: string, viewId: string): Promise<void> {
  await connection.connect();
  const query: string = `
    UPDATE SubItems
    SET deleted_at = GETDATE()
    WHERE id = @subItemId
  `;

  await connection
    .request()
    .input('subItemId', subItemId)
    .query(query);

  revalidatePath(`board/${boardId}/view/${viewId}`);
}
