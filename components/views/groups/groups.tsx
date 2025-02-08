"use client";

import { GroupItemTable } from "@/components/common/groupItem/groupItem";
import { GroupData } from "@/utils/common/types";
import styles from './styles.module.css';

const groups: Array<GroupData> = [
  {
    id: "493",
    title: "Abiertos",
    color: "#1773e3",
    items: [
      {
        id: "342",
        title: "J-0001",
        createdAt: "Sat May 11 2024 17:32:47 GMT-0600 (hora estándar central)",
        updatedAt: "Mon Feb 03 2025 09:22:09 GMT-0600 (hora estándar central)",
        totalTasks: 5,
        completedTasks: 1,
        chats: [
          {
            id: "1643ee6b-40d4-4eb2-80a4-a311e98d1376",
            message:
              '<h1>Objetivo semanal</h1><p></p><ul data-type="taskList"><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Definir diseño</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Terminar programación</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Tomar café</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Establecer presupuesto</p></div></li></ul>',
            tasks: [
              {
                id: "33230e28-d15a-4340-b326-737fe7b31845",
                chatId: "a4fc0bd9-a55f-4524-b8a8-93ca32fb495c",
                isCompleted: false,
                content: "spiritus quidem artificiose et uberrime",
              },
              {
                id: "33230e28-d15a-4340-b326-737fe7b31845",
                chatId: "a4fc0bd9-a55f-4524-b8a8-93ca32fb495c",
                isCompleted: false,
                content: "spiritus quidem artificiose et uberrime",
              },
              {
                id: "33230e28-d15a-4340-b326-737fe7b31845",
                chatId: "a4fc0bd9-a55f-4524-b8a8-93ca32fb495c",
                isCompleted: false,
                content: "spiritus quidem artificiose et uberrime",
              },
              {
                id: "33230e28-d15a-4340-b326-737fe7b31845",
                chatId: "a4fc0bd9-a55f-4524-b8a8-93ca32fb495c",
                isCompleted: false,
                content: "spiritus quidem artificiose et uberrime",
              },
            ],
            createdAt:
              "Sun Nov 26 2023 23:41:28 GMT-0600 (hora estándar central)",
            updatedAt:
              "Mon Feb 03 2025 05:13:06 GMT-0600 (hora estándar central)",
          },
          {
            id: "77a0c8b4-f582-4627-9414-c1fc55fc3305",
            message:
              '<h1>Elementos faltantes</h1><ul><li><p>Café diario</p></li><li><p>Botanas gratis</p></li><li><p>Sala para dormirse 15 minutos</p></li><li><p>aerosol para el baño</p></li></ul>',
            tasks: [
              {
                id: "9aa03fe0-b905-4db5-b693-033172f5f942",
                chatId: "a8a31972-eea0-40df-9cce-3ba5fea3461a",
                isCompleted: true,
                content: "copiose taceo adficio tabernus cometes",
              },
            ],
            createdAt:
              "Sun Sep 15 2024 02:49:56 GMT-0600 (hora estándar central)",
            updatedAt:
              "Sun Feb 02 2025 11:43:04 GMT-0600 (hora estándar central)",
          },
        ],
        properties: [
          {
            id: "903e1403-5820-4638-b07d-0d424c4a2ed3",
            itemId: "342",
            userTitle: "Empresa",
            propertyTitle: "Estatus",
            type: "Status",
            value: "ElRinKlinger",
            color: "#6980cb",
          },
          {
            id: "871e215e-a8e8-4fd1-9544-fdabcb8c5012",
            itemId: "342",
            userTitle: "Estaciones",
            propertyTitle: "Numero",
            type: "Number",
            format: "Count",
            value: "5",
          },
          {
            id: "23425782-15b0-4fe8-92eb-df46e3185631",
            itemId: "342",
            userTitle: "Fecha de pago",
            propertyTitle: "Fecha",
            type: "Date",
            value: "13/02/2026",
          },
          {
            id: "30081071-652d-404e-8b5e-348558b7990c",
            itemId: "342",
            userTitle: "TimeLine",
            propertyTitle: "TimeLine",
            type: "TimeLine",
            startDate: "14/02/2022",
            endDate: "23/05/2030",
          },
          {
            id: "78eb8382-37ed-4f94-8dac-c7e064f8c5a9",
            itemId: "342",
            userTitle: "PM",
            propertyTitle: "Persona",
            type: "User",
            userName: "https://avatars.githubusercontent.com/u/83173399",
          },
        ],
      },
      {
        id: "637",
        title: "J-0002",
        createdAt: "Fri Mar 15 2024 16:03:21 GMT-0600 (hora estándar central)",
        updatedAt: "Sat Feb 01 2025 15:06:08 GMT-0600 (hora estándar central)",
        totalTasks: 0,
        completedTasks: 0,
        chats: [],
        properties: [
          {
            id: "5877d216-8db9-4245-a70b-5fb81c27cad4",
            itemId: "637",
            userTitle: "Empresa",
            propertyTitle: "Estatus",
            type: "Status",
            value: "Valeo",
            color: "#95c9b6",
          },
          {
            id: "bf321e15-7d00-46b1-be63-8da87d3cbc18",
            itemId: "637",
            userTitle: "Estaciones",
            propertyTitle: "Numero",
            type: "Number",
            format: "Count",
            value: "12",
          },
          {
            id: "22f29262-df1a-4e71-9625-3ffa82fe3a8d",
            itemId: "637",
            userTitle: "Fecha de pago",
            propertyTitle: "Fecha",
            type: "Date",
            value: "31/07/2025",
          },
          {
            id: "672fa2cc-eda9-4f22-ad59-6a78cd28dbe0",
            itemId: "637",
            userTitle: "TimeLine",
            propertyTitle: "TimeLine",
            type: "TimeLine",
            startDate: "13/01/2023",
            endDate: "25/04/2025",
          },
          {
            id: "0b7a4881-4ec7-4630-b2c7-9d051388b6d6",
            itemId: "637",
            userTitle: "PM",
            propertyTitle: "Persona",
            type: "User",
            userName: "https://avatars.githubusercontent.com/u/22182073",
          },
        ],
      },
    ],
  },
];

export const Groups = () => {
  return (
    <article className={styles.container}>
      {groups.map((group) => (
        <GroupItemTable key={group.id} group={group} />
      ))}
    </article>
  );
};
