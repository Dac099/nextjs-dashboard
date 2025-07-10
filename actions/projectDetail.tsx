"use server";
import connection from "@/services/database";
import { revalidatePath } from "next/cache";
import { faker } from "@faker-js/faker";
import { Item, OCQuote, ProjectType, QuoteItem, SectorItem, Currency, MachineDB, EmployeeField, FieldWithEmployees, ProjectFormData } from "@/utils/types/projectDetail";
import { groupItemsByType } from "@/utils/helpers";
import { ResponseChat, Response as ResponseItem } from "@/utils/types/items";
import { getUserInfo } from './auth';

export async function addGroupToBillingBoard(name: string): Promise<string> {
  await connection.connect();
  const billingBoard = "7B751882-33C5-44EC-A8CB-67EC93D46653";
  const colorGroup: string = faker.color.rgb();

  const selectQuery: string = `
        SELECT id  FROM Groups WHERE name = @name AND deleted_at IS NULL;
    `;

  const selectResult = await connection
    .request()
    .input("name", name)
    .query(selectQuery);

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
    .input("name", name)
    .input("boardId", billingBoard)
    .input("color", colorGroup)
    .query(insertQuery);

  revalidatePath(
    `/board/7B751882-33C5-44EC-A8CB-67EC93D46653/view/D0D74A90-1098-4E7E-A09B-D6DCD2F26179`
  );
  return insertResult.recordset[0].id;
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
    .input("groupId", groupId)
    .input("name", "Sin nombre")
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
    .input("groupId", groupId)
    .query(getDataQuery);

  return groupItemsByType(result.recordset);
}

export async function addItemChat(
  entry: ResponseChat,
  itemId: string
): Promise<void> {
  try {
    await connection.connect();
    const insertQuery: string = `
            INSERT INTO Chats (id, item_id, message, created_by, responses, tasks)
            VALUES (@id, @itemId, @message, @createdBy, @responses, @tasks);
        `;
    const result = await connection
      .request()
      .input("id", entry.id)
      .input("itemId", itemId)
      .input("message", entry.message)
      .input("createdBy", JSON.stringify(entry.author))
      .input("responses", JSON.stringify(entry.responses))
      .input("tasks", JSON.stringify(entry.tasks))
      .query(insertQuery);

    console.log(result);
  } catch {
    throw new Error("Ocurrió un error al crear el chat");
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
      .input("itemId", itemId)
      .query(selectQuery);

    return result.recordset.map(
      (chat) =>
        ({
          id: chat.id,
          message: chat.message,
          author: JSON.parse(chat.author),
          responses: JSON.parse(chat.responses),
          tasks: JSON.parse(chat.tasks),
        } as ResponseChat)
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw new Error("Ocurrió un error al obtener los chats");
  }
}

export async function addChatResponse(
  chatId: string,
  responses: ResponseItem[]
): Promise<void> {
  try {
    await connection.connect();
    const insertQuery: string = `
            UPDATE Chats
            SET responses = @responses
            WHERE id = @chatId;
        `;

    await connection
      .request()
      .input("chatId", chatId)
      .input("responses", JSON.stringify(responses))
      .query(insertQuery);
  } catch (error) {
    console.error("Error adding chat response:", error);
    throw new Error("Ocurrió un error al agregar la respuesta al chat");
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
      .input("chatId", newChat.id)
      .input("message", newChat.message)
      .input("tasks", JSON.stringify(newChat.tasks))
      .query(updateQuery);
  } catch {
    throw new Error("Ocurrió un error al actualizar el chat");
  }
}

export async function getTotalQuotes(filter: null | string = null): Promise<number> {
  try {
    await connection.connect();
    const countQuery: string = `
        SELECT COUNT(*) as total
        FROM tb_cotizacion quote 
        INNER JOIN tb_cliente client ON client.id_cliente = quote.id_cliente
        WHERE quote.estatus = '100'
        ${filter ? 'AND (quote.cotizacion LIKE @filterPattern OR client.nom_cliente LIKE @filterPattern OR quote.nom_proyecto LIKE @filterPattern)' : ''}
    `;

    const request = connection.request();
    
    if (filter) {
      request.input("filterPattern", `%${filter}%`);
    }
    
    const result = await request.query(countQuery);
    
    return result.recordset[0].total;
  } catch (error) {
    console.log(
      `Error fetching total quotes: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener el total de cotizaciones");
  }
}

export async function getQuotesForProyect(offset: number = 0, limit: number = 20, filter: null | string): Promise<QuoteItem[]> {
  try {
    await connection.connect();    const selectQuery: string = `
        SELECT 
            quote.id_cotizacion AS id,
            quote.cotizacion AS quote,
            quote.revision,
            client.nom_cliente AS clientName,
            client.id_cliente AS clientId,
            quote.nom_proyecto AS proyectName, 
            quote.presupuesto_maquinados AS machineBudget,
            quote.presupuesto_p_linea_mecanica AS mechanicalBudget,
            quote.presupuesto_electrico AS electricalBudget,
            quote.presupuesto_componentes_especiales AS specialComponentsBudget,
            quote.horas_diseño_mecanico AS mechanicalDesignTime,
            quote.horas_diseño_electrico AS electricalDesignTime, 
            quote.horas_ensamble_programacion AS assemblyTime,
            quote.horas_otro AS otherTime,
            quote.semanas_propuestas AS definedWeeks,
            quote.fecha_po AS poDate,
            quote.notas AS notas,
            quote.estatus AS status,
            quote.fecha_registro AS createdAt,
            quote.horas_programacion AS developmentTime,
            quote.monto_total AS totalBudget
        FROM tb_cotizacion quote 
        INNER JOIN tb_cliente client ON client.id_cliente = quote.id_cliente
        WHERE quote.estatus = '100'
        ${filter ? 'AND (quote.cotizacion LIKE @filterPattern OR client.nom_cliente LIKE @filterPattern OR quote.nom_proyecto LIKE @filterPattern)' : ''}
        ORDER BY quote.fecha_registro DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
    `;    
    
    const request = connection.request()
      .input("offset", offset)
      .input("limit", limit);
      
    if (filter) {
      request.input("filterPattern", `%${filter}%`);
    }
    
    const result = await request.query(selectQuery);

    return result.recordset as QuoteItem[];
  } catch (error) {
    console.log(
      `Error fetching quotes: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener las cotizaciones");
  }
}

export async function getProjectTypes(): Promise<ProjectType[]>
{
  try {
    await connection.connect();
    const selectQuery: string = `
      SELECT 
        id_tipo_pro as id,
        identificador as prefix,
        nom_tipo as title,
        desc_tipo as description,
        contador_inicial as initialCounter,
        contador_actual as currentCounter 
      FROM tb_pro_tipo 
      WHERE tipo_sel='Proy' 
        AND ESTATUS=1
    `;
    const result = await connection.request().query(selectQuery);
    const resultSet = result.recordset.filter(typeProject => typeProject.title.trim() !== 'Selecciona');
    return resultSet as ProjectType[];
  } catch (error) {
    console.log(
      `Error fetching project types: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener los tipos de proyecto");
  }
}

export async function getPOQuote(quoteId: string): Promise<OCQuote[]> {
  try {
    await connection.connect();
    const selectQuery: string = `
      SELECT 
        id_oc_cotizacion AS id, 
        num_oc AS ocNumber,
        id_cotizacion AS quoteId,
        po_cliente AS poClient,
        fecha_po AS poDate,
        nombre_archivo_po AS pathUrl
      FROM tb_oc_cotizacion
      WHERE id_cotizacion = @quoteId
    `;
    const result = await connection
      .request()
      .input("quoteId", quoteId)
      .query(selectQuery);

    return result.recordset as OCQuote[];
  } catch (error) {
    console.log(
      `Error fetching PO quotes: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener las cotizaciones de OC");
  }
}

export async function getSectors(): Promise<SectorItem[]> {
  try {
    await connection.connect();
    const selectQuery: string = `
      SELECT 
        id_div AS id,
        nombre AS name
      FROM tb_mach_div
      WHERE nombre <> 'Selecciona'
    `;
    const result = await connection.request().query(selectQuery);
    return result.recordset as SectorItem[];
  } catch (error) {
    console.log(
      `Error fetching sectors: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener los sectores");
  }
}

export async function getCurrencies(): Promise<Currency[]> {
  try {
    await connection.connect();
    const selectQuery: string = `
      SELECT 
        id_moneda AS id,
        desc_moneda AS name
      FROM tb_oc_moneda
      WHERE desc_moneda <> 'Selecciona'
    `;
    const result = await connection.request().query(selectQuery);
    return result.recordset as Currency[];
  } catch (error) {
    console.log(
      `Error fetching currencies: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener las monedas");
  }
}

export async function getMachines(): Promise<MachineDB[]> {
  try {
    await connection.connect();
    const selectQuery: string = `
      SELECT 
        tm.num_serie AS serialNumber,
        tm.detail AS detail,
        tm.title AS title,
        tm.usuario AS owner,
        tmd.desc_div AS description,
        cli.nom_cliente AS clientName,
        tm.id_sector AS fieldId,
        tmd.nombre AS fieldName,
        tm.id_cliente AS clientId,
        tm.id_proyect AS projectId
      FROM tb_machine tm
      JOIN tb_cliente cli ON tm.id_cliente = cli.id_cliente
      JOIN tb_mach_div tmd ON tmd.id_div = tm.id_sector
    `;
    const result = await connection.request().query(selectQuery);
    return result.recordset as MachineDB[];
  } catch (error) {
    console.log(
      `Error fetching machines: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener las máquinas");
  }
}

export async function getEmployeesByField(): Promise<FieldWithEmployees> {
  try {
    await connection.connect();
    const selectQuery: string = `
      SELECT 
        tu.id_user AS userId,
        tu.nom_user AS username,
        ta.nom_area AS employeeField
      FROM tb_user tu
      INNER JOIN tb_area ta ON ta.id_area = tu.id_depto
      WHERE tu.id_depto IN (5,7,11,12)
    `;
    const result = await connection.request().query(selectQuery);

    const fields:FieldWithEmployees = {};
    result.recordset.forEach((employee: EmployeeField) => {
      if (!fields[employee.employeeField]) {
        fields[employee.employeeField] = [];
      }
      fields[employee.employeeField].push({
        username: employee.username,
        userId: employee.userId,
      });
    });
    return fields;
  } catch (error) {
    console.log(
      `Error fetching employees by field: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener los empleados por campo");
  }
}

export async function getNewMachineSerialNumber(): Promise<string> {
  try{
    await connection.connect();
    const selectQuery: string = `
      SELECT MAX(num_serie) as serialNumber
      FROM tb_machine
    `;
    const result = await connection
      .request()
      .query(selectQuery);
    const maxSerialNumber = result.recordset[0].serialNumber;
    const [prefix, incremental] = maxSerialNumber.split("-");

    return `${prefix}-${parseInt(incremental) + 1}`;
  }catch (error) {
    console.log(
      `Error fetching new machine serial number: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al obtener el nuevo número de serie");
  }
}

export async function insertNewMachine(
  name: string, 
  description: string, 
  projectId: string, 
  clientId: string, 
  sectorId: string, 
): Promise<string> {
  try {
    await connection.connect();
    const insertQuery: string = `
      INSERT INTO tb_machine (num_serie, title, detail, id_proyect, id_cliente, id_sector, usuario)
      VALUES (@serialNumber, @name, @description, @projectId, @clientId, @sectorId, @owner);
    `;
    const {name: owner} = await getUserInfo();
    const serialNumber = await getNewMachineSerialNumber();

    await connection
      .request()
      .input("serialNumber", serialNumber)
      .input("name", name)
      .input("description", description)
      .input("projectId", projectId)
      .input("clientId", clientId)
      .input("sectorId", sectorId)
      .input("owner", owner)
      .query(insertQuery);

    return serialNumber
  } catch (error) {
    console.log(
      `Error inserting new machine: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al insertar la nueva máquina");
  }
}

export async function insertNewProject(projectFormData: ProjectFormData): Promise<void> {
  try {
    await connection.connect();
    const { id: userId } = await getUserInfo();

    const insertQuery: string = `
      INSERT INTO tb_proyect (
        id_proyect, 
        id_cliente, 
        id_user, 
        id_tipo_pro, 
        id_estado, 
        id_sector, 
        nom_proyecto, 
        desc_proyecto, 
        lider_proyecto, 
        presupuesto_inicial, 
        presupuesto_aut, 
        id_moneda, 
        fecha_inicio, 
        fecha_fin, 
        ruta_archivos, 
        fecha_registro, 
        nota, 
        user_01, 
        num_serie, 
        tipo_cambio, 
        num_oc, 
        num_cot, 
        facturado, 
        num_factura, 
        presupuesto_meca, 
        presupuesto_aut_meca, 
        presupuesto_maqui, 
        presupuesto_aut_maqui, 
        presupuesto_elect, 
        presupuesto_aut_elect, 
        presupuesto_otro, 
        presupuesto_aut_otro, 
        cantidad_jobs, 
        horas_diseño_mecanico, 
        horas_diseño_electrico, 
        horas_ensamble_programacion, 
        horas_programacion, 
        horas_otros, 
        fecha_kickoff, 
        fecha_po, 
        fecha_iguales, 
        semanas_propuestas, 
        responsable_project_manager, 
        responsable_diseñador_mecanico, 
        responsable_diseñador_electrico, 
        responsable_programador, 
        responsable_ensamblador, 
        link_carpeta
        ) VALUES(
          @idProyect,
          @clientId,
          @userId,
          @tipoProyect,
          @estado,
          @sector,
          @nombreProyecto,
          @descripcionProyecto,
          @liderProyecto,
          @presupuestoInicial,
          @presupuestoAut,
          @moneda,
          @fechaInicio,
          @fechaFin,
          @rutaArchivos,
          GETDATE(),
          @nota,
          NULL,
          @numSerie,
          NULL,
          NULL,
          @numCot,
          @facturado,
          @numFactura,
          @presupuestoMeca,
          @presupuestoAutMeca,
          @presupuestoMaqui,
          @presupuestoAutMaqui,
          @presupuestoElect,
          @presupuestoAutElect,
          @presupuestoOtro,
          @presupuestoAutOtro,
          @cantidadJobs,
          @horasDiseñoMecanico,
          @horasDiseñoElectrico,
          @horasEnsambleProgramacion,
          @horasProgramacion,
          @horasOtros,
          @fechaKickoff,
          @fechaPo,
          @fechaIguales,
          @semanasPropuestas,
          @responsableProjectManager,
          @responsableDiseñadorMecanico,
          @responsableDiseñadorElectrico,
          @responsableProgramador,
          @responsableEnsamblador,
          @linkCarpeta
        );
    `;

    await connection
    .request()
    .input('idProyect', projectFormData.projectFolio)
    .input('clientId', projectFormData.quoteItem?.clientId || '')
    .input('userId', userId)
    .input('tipoProyect', projectFormData.typeProject)
    .input('estado', projectFormData.status)
    .input('sector', projectFormData.sector)
    .input('nombreProyecto', projectFormData.projectName)
    .input('descripcionProyecto', projectFormData.projectDescription)
    .input('liderProyecto', projectFormData.projectManagerId)
    .input('presupuestoInicial', projectFormData.totalBudget)
    .input('presupuestoAut', 0)
    .input('moneda', projectFormData.currency)
    .input('fechaInicio', projectFormData.poDate)
    .input('fechaFin', projectFormData.deadline)
    .input('rutaArchivos', projectFormData.linkDrive)
    .input('nota', projectFormData.notes)
    .input('numSerie', projectFormData.machines.length === 1 ? projectFormData.machines[0].serialNumber : 'NULL')
    .input('numCot', projectFormData.quoteItem?.quote || '')
    .input('facturado', 0)
    .input('numFactura', projectFormData.billNumber || '')
    .input('presupuestoMeca', projectFormData.mechanicalBudget)
    .input('presupuestoAutMeca', 0)
    .input('presupuestoMaqui', projectFormData.machineBudget)
    .input('presupuestoAutMaqui', 0)
    .input('presupuestoElect', projectFormData.electricalBudget)
    .input('presupuestoAutElect', 0)
    .input('presupuestoOtro', projectFormData.otherBudget)
    .input('presupuestoAutOtro', 0)
    .input('cantidadJobs', projectFormData.jobsQuantity)
    .input('horasDiseñoMecanico', projectFormData.mechanicalDesignTime)
    .input('horasDiseñoElectrico', projectFormData.electricalDesignTime)
    .input('horasEnsambleProgramacion', projectFormData.assemblyTime)
    .input('horasProgramacion', projectFormData.developmentTime)
    .input('horasOtros', projectFormData.otherTime)
    .input('fechaKickoff', projectFormData.kickOffDate)
    .input('fechaPo', projectFormData.poDate)
    .input('fechaIguales', projectFormData.equalDates)
    .input('semanasPropuestas', projectFormData.proposedWeeks)
    .input('responsableProjectManager', projectFormData.projectManagerId)
    .input('responsableDiseñadorMecanico', projectFormData.mechanicalDesignerId)
    .input('responsableDiseñadorElectrico', projectFormData.electricalDesignerId)
    .input('responsableProgramador', projectFormData.developerId)
    .input('responsableEnsamblador', projectFormData.assemblerId)
    .input('linkCarpeta', projectFormData.linkDrive)
    .query(insertQuery);

    await updateProjectCounter(projectFormData);
  } catch (error) {
    console.log(error);
  }
}

export async function insertMachinesProject(projectFormData: ProjectFormData): Promise<void> {
  if( projectFormData.machines.length <= 1) return;

  try{
    await connection.connect();
    
    // Ejecutar una consulta de inserción por cada máquina
    for (const machine of projectFormData.machines) {
      const insertQuery: string = `
        INSERT INTO tb_machines_projects (
          id_project, 
          initial_budget,  
          num_serie, 
          mechanical_budget,
          machining_budget, 
          electrical_budget,
          other_budget,
          hours_mechanical_design,
          hours_electrical_design,
          hours_asembly_development,
          hours_development,
          hours_other,
          mechanical_designer,
          electrical_designer,
          developer,
          assembler,
          project_manager  
        ) VALUES (
          @idProject,
          @initialBudget,
          @numSerie,
          @mechanicalBudget,
          @machiningBudget,
          @electricalBudget,
          @otherBudget,
          @hoursMechanicalDesign,
          @hoursElectricalDesign,
          @hoursAssemblyDevelopment,
          @hoursDevelopment,
          @hoursOther,
          @mechanicalDesigner,
          @electricalDesigner,
          @developer,
          @assembler,
          @projectManager
        )
      `;
      
      await connection
        .request()
        .input('idProject', projectFormData.projectFolio)
        .input('initialBudget', projectFormData.totalBudget)
        .input('numSerie', machine.serialNumber)
        .input('mechanicalBudget', machine.mechanicalBudget)
        .input('machiningBudget', machine.machineBudget)
        .input('electricalBudget', machine.electricalBudget)
        .input('otherBudget', machine.otherBudget)
        .input('hoursMechanicalDesign', machine.mechanicalDesignTime)
        .input('hoursElectricalDesign', machine.electricalDesignTime)
        .input('hoursAssemblyDevelopment', machine.assemblyTime)
        .input('hoursDevelopment', machine.developmentTime)
        .input('hoursOther', machine.otherTime)
        .input('mechanicalDesigner', projectFormData.mechanicalDesignerId)
        .input('electricalDesigner', projectFormData.electricalDesignerId)
        .input('developer', projectFormData.developerId)
        .input('assembler', projectFormData.assemblerId)
        .input('projectManager', projectFormData.projectManagerId)
        .query(insertQuery);
    }
  }catch(error) {
    console.log(error);
  }
}

async function updateProjectCounter(projectFormData: ProjectFormData): Promise<void> {
  try {
    await connection.connect();
    const updateQuery: string = `
      UPDATE tb_pro_tipo
      SET contador_actual = contador_actual + 1
      WHERE id_tipo_pro = @tipoProyect;
    `;

    await connection
      .request()
      .input('tipoProyect', projectFormData.typeProject)
      .query(updateQuery);
  } catch (error) {
    console.log(
      `Error updating project counter: ${error instanceof Error ? error.message : error}`
    );
    throw new Error("Ocurrió un error al actualizar el contador del proyecto");
  }
}