'use client';
import css from './groupContainer.module.css';
import { ColumnData, GroupData } from '@/utils/types/views';

type Props = {
  groupData: GroupData;
  boardColumns: ColumnData[];
};

export function GroupContainer({ groupData, boardColumns }: Props) {
  return (
    <table 
      className={css.groupContainer}
      style={{
        borderLeft: `5px solid ${groupData.color}`,
      }}
    >
      <thead>
        <tr>
          <th 
            className={css.cell}
            draggable={false}
          >
            Item
          </th>
          {boardColumns.map((column) => (
            <th 
              key={column.id}
              className={`${css.cellHeader} ${css.cell}`}
            >
              {column.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {groupData.items.map((item) => (
          <tr 
            key={item.id}
          >
            <td className={css.cell}>{item.name}</td>
            {boardColumns.map((column) => {
              // const value = item.values.find((v) => v.columnId === column.id);
              return (
                <td key={column.id} className={css.cell}>
                  <p>value</p>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}