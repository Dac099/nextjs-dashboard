'use client';

import { GroupItemTable } from '@/components/common/groupItem/groupItem';
import { faker } from '@faker-js/faker';
import { GroupData } from '@/utils/common/types';

const groups: Array<GroupData> = [
  {
    id: faker.number.int({min: 0, max: 1000}).toString(),
    title: faker.lorem.words(1),
    color: faker.color.rgb(),
    items: [
      {
        id: faker.number.int({min: 0, max: 1000}).toString(),
        title: faker.lorem.words(5),
        createdAt: faker.date.past({years: 2}).toString(),
        updatedAt: faker.date.recent({days: 4}).toString(),
        totalTasks: faker.number.int({min: 0, max: 5}),
        completedTasks: faker.number.int({min: 5, max: 10}),
        chats: [
          {
            id: faker.string.uuid(),
            message: faker.lorem.words(10),
            tasks: [
              {
                id: faker.string.uuid(),
                chatId: faker.string.uuid(),
                isCompleted: faker.datatype.boolean(),
                content: faker.lorem.words(5)
              }
            ],
            createdAt: faker.date.past({years: 2}).toString(),
            updatedAt: faker.date.recent({days: 4}).toString()
          },
          {
            id: faker.string.uuid(),
            message: faker.lorem.words(10),
            tasks: [
              {
                id: faker.string.uuid(),
                chatId: faker.string.uuid(),
                isCompleted: faker.datatype.boolean(),
                content: faker.lorem.words(5)
              }
            ],
            createdAt: faker.date.past({years: 2}).toString(),
            updatedAt: faker.date.recent({days: 4}).toString()
          }
        ],
        properties: [
          {
            id: faker.string.uuid(),
            userTitle: 'Empresa',
            propertyTitle: 'Estatus',
            type: 'Status',
            value: 'Valeo',
            color: faker.color.rgb()
          },
          {
            id: faker.string.uuid(),
            userTitle: 'Estaciones',
            propertyTitle: 'Numero',
            type: 'Number',
            format: 'Count',
            value: '12'
          },
          {
            id: faker.string.uuid(),
            userTitle: 'Fecha de pago',
            propertyTitle: 'Fecha',
            type: 'Date',
            value: faker.date.future({years: 2}).toString()
          },
          {
            id: faker.string.uuid(),
            userTitle: 'TimeLine',
            propertyTitle: 'TimeLine',
            type: 'TimeLine',
            startDate: faker.date.past({years: 1}).toString(),
            endDate: faker.date.future({years: 1}).toString()
          },
          {
            id: faker.string.uuid(),
            userTitle: 'PM',
            propertyTitle: 'Persona',
            type: 'User',
            userName: faker.image.avatar()
          },
        ]
      },
      
      {
        id: faker.number.int({min: 0, max: 1000}).toString(),
        title: faker.lorem.words(5),
        createdAt: faker.date.past({years: 2}).toString(),
        updatedAt: faker.date.recent({days: 4}).toString(),
        totalTasks: faker.number.int({min: 0, max: 5}),
        completedTasks: faker.number.int({min: 5, max: 10}),
        chats: [
          {
            id: faker.string.uuid(),
            message: faker.lorem.words(10),
            tasks: [
              {
                id: faker.string.uuid(),
                chatId: faker.string.uuid(),
                isCompleted: faker.datatype.boolean(),
                content: faker.lorem.words(5)
              }
            ],
            createdAt: faker.date.past({years: 2}).toString(),
            updatedAt: faker.date.recent({days: 4}).toString()
          },
          {
            id: faker.string.uuid(),
            message: faker.lorem.words(10),
            tasks: [
              {
                id: faker.string.uuid(),
                chatId: faker.string.uuid(),
                isCompleted: faker.datatype.boolean(),
                content: faker.lorem.words(5)
              }
            ],
            createdAt: faker.date.past({years: 2}).toString(),
            updatedAt: faker.date.recent({days: 4}).toString()
          }
        ],
        properties: [
          {
            id: faker.string.uuid(),
            userTitle: 'Empresa',
            propertyTitle: 'Estatus',
            type: 'Status',
            value: 'Valeo',
            color: faker.color.rgb()
          },
          {
            id: faker.string.uuid(),
            userTitle: 'Estaciones',
            propertyTitle: 'Numero',
            type: 'Number',
            format: 'Count',
            value: '12'
          },
          {
            id: faker.string.uuid(),
            userTitle: 'Fecha de pago',
            propertyTitle: 'Fecha',
            type: 'Date',
            value: faker.date.future({years: 2}).toString()
          },
          {
            id: faker.string.uuid(),
            userTitle: 'TimeLine',
            propertyTitle: 'TimeLine',
            type: 'TimeLine',
            startDate: faker.date.past({years: 1}).toString(),
            endDate: faker.date.future({years: 1}).toString()
          },
          {
            id: faker.string.uuid(),
            userTitle: 'PM',
            propertyTitle: 'Persona',
            type: 'User',
            userName: faker.image.avatar()
          },
        ]
      },

    ]
  }
];

export const Groups = () => {
  return (
    <>
      {
        groups.map((group) => (
          <GroupItemTable key={group.id} group={group} />
        ))
      }
    </>
  );
}