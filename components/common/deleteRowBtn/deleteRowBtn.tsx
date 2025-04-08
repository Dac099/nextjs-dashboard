'use client';
import { deleteGroupRow } from '@/actions/groups';
import styles from './deleteRowBtn.module.css';
import { useParams } from 'next/navigation';
import { AiOutlineDeleteRow } from 'react-icons/ai';
import { deleteSubItem } from '@/actions/items';
import { useItemStore } from '@/stores/useItemStore';
import { findParentKeyBySubItemId } from '@/utils/helpers';

type Props = {
  itemId: string;
  isSubItem?: boolean;
};

export function DeleteRowBtn({ itemId, isSubItem = false }: Props) {
  const { id: boardId, viewId } = useParams();
  const deleteSubItemStore = useItemStore(state => state.removeSubItem);
  const subItemsMap = useItemStore(state => state.subItemsMap);
  async function handleClick() {
    if (isSubItem) {
      await deleteSubItem(itemId, boardId as string, viewId as string);
      deleteSubItemStore(findParentKeyBySubItemId(subItemsMap, itemId) as string, itemId);
      return;
    }

    await deleteGroupRow(itemId, boardId as string, viewId as string);
  }

  return (
    <article
      onClick={() => handleClick()}
    >

      <AiOutlineDeleteRow
        size={20}
        className={styles.deleteRow}
      />
    </article>
  );
}
