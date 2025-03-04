'use client';
import { deleteGroupRow } from '@/actions/groups';
import styles from './deleteRowBtn.module.css';
import { useParams } from 'next/navigation';
import { AiOutlineDeleteRow } from 'react-icons/ai';

type Props = {
  itemId: string;
};

export function DeleteRowBtn({itemId}: Props)
{
  const {id: boardId, viewId} = useParams();

  async function handleClick()
  {
    await deleteGroupRow(itemId, boardId as string, viewId as string);
  }

  return (
    <AiOutlineDeleteRow 
        size={20} 
        className={styles.deleteRow}
        onClick={() => handleClick()}
    />
  );
}