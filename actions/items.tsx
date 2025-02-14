'use server';
import connection from '@/services/database';
import { Project } from 'next/dist/build/swc/types';

export type ChatType = {
  id: string;
  creator: string;
  message: string;
  createdAt: string;
};

export type ProjectType = {
  id: string;
  client: string;
  projectType: string;
  state: string;
  name: string;
  description: string;
};

export type ProjectDetailType = {
  title: string;
  projectData: ProjectType;
  chats: Array<ChatType>
};

export async function getProjectDetail(itemId: string): Promise<ProjectDetailType | Error> {
  const itemQuery: string = `
    SELECT 
      Title AS title, 
      Proyect_Id AS projectId
    FROM Item
    WHERE Item_Id = @itemId;
  `;

  const projectQuery: string = `
    SELECT
      p.id_proyect AS id,
      c.nom_cliente AS client,
      pt.nom_tipo AS projectType,
      es.nom_estado AS state,
      p.nom_proyecto AS name,
      p.desc_proyecto AS description
    FROM tb_proyect p
    LEFT JOIN tb_cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN tb_pro_tipo pt ON p.id_tipo_pro = pt.id_tipo_pro
    LEFT JOIN tb_eq_estatus es ON p.id_estado = es.id_estado
    WHERE p.id_proyect = @projectId;
  `;

  const chatQuery: string = `
    SELECT 
      PChat_Id AS id,
      'Usuario temporal' AS creator,
      Message AS message,
      Created_At AS createdAt
    FROM PChat 
    WHERE Item_Id = @itemId;
  `;
  
  try {
    await connection.connect(); 
    const itemData = (await connection
      .request()
      .input('itemId', itemId)
      .query(itemQuery)).recordset[0];

    const projectData = (await connection
      .request()
      .input('projectId', itemData.projectId)
      .query(projectQuery)).recordset[0];  
    
    const chats = (await connection
      .request()
      .input('itemId', itemId)
      .query(chatQuery)).recordset

    return {
      title: itemData.title,
      projectData,
      chats
    };
  } catch (error) {
    console.log(error);
    return new Error('ERROR: cannot get project detail');
  }
}

export async function updateItemTitle(itemId: string, newTitle: string, pageId: string, viewId: string): Promise<number | Error> {
  const query: string = `
    UPDATE Item
    SET Title = @newTitle
    WHERE Item_Id = @itemId;
  `;

  try {
    await connection.connect();
    const result = await connection
      .request()
      .input('newTitle', newTitle)
      .input('itemId', itemId)
      .query(query);

    return result.rowsAffected[0];
  } catch (error) {
    console.log(error);
    return new Error('ERROR: cannot update item title');
  }
}