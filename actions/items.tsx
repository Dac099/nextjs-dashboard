'use server';
import connection from '@/services/database';
import type {Item, ProjectData, ResponseChats} from '@/utils/types/items';

export async function getItemChats(itemId: string): Promise<ResponseChats>
{
  const query: string = `
    SELECT
      c.id,
      c.message,
      c.responses, 
      c.tasks,
      c.updated_at,
      ISNULL(tu.nom_user, 'Anónimo') as author
    FROM Chats c
    LEFT JOIN tb_user tu ON c.created_by = tu
    .id_user
    WHERE c.deleted_at IS NULL AND item_id = @itemId
    ORDER BY c.created_at
  `;

  await connection.connect();

  const result = (await connection
    .request()
    .input('itemId', itemId)
    .query(query)).recordset[0];

  return result ? result : {};
}

export async function updateItemName(itemId: string, itemName: string): Promise<void>
{
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

export async function getProjectData(projectId: string): Promise<ProjectData[]>
{
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
    LEFT JOIN tb_user tu ON tc.user_id = tp_user_id
    LEFT JOIN tp_pro_tipo tpt ON tpt.id_tipo_pro = tp.id_tipo_pro
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

export async function getItemDetail(itemId: string): Promise<Item[]>
{
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