import styles from './tagEditor.module.css';
import { useBoardStore } from '@/stores/boardStore';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { updateTagStatus } from '@/actions/items';

type Props = {
  tag: {
    color: string;
    text: string;
    id: string;
  };
  onClose: () => void;
  columnId: string;
}

export function TagEditor({ tag, onClose, columnId }: Props) {
  const updateBoardStatus = useBoardStore(state => state.updateStatus);
  const [tagColor, setTagColor] = useState<string>(tag.color);
  const [tagText, setTagText] = useState<string>(tag.text);
  const [error, setError] = useState<string | null>(null);

  const handleTagTextChange = (newValue: string) => {
    setTagText(newValue);
  }

  const updateTag = async () => {
    if (tagText.length === 0) {
      setError('El nombre del tag no puede estar vacío');
      return;
    }

    const newTag = {
      color: tagColor,
      text: tagText,
      id: tag.id
    };

    const statusValue = {
      value: JSON.stringify({ color: tagColor, text: tagText }),
      id: tag.id,
      columnId: columnId
    }

    updateBoardStatus(statusValue);
    await updateTagStatus(newTag, columnId, tag);
    onClose();
  }

  return (
    <section>
      {error && <p className={styles.errorMsg}>{error}</p>}
      <input
        type="text"
        value={tagText}
        onChange={e => handleTagTextChange(e.target.value)}
        className={styles.tagInput}
      />

      <article className={styles.colorInputContainer}>
        <HexColorPicker
          color={tag.color}
          onChange={setTagColor}
        />
      </article>

      <section className={styles.controls}>
        <button
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={updateTag}
        >
          Guardar
        </button>
      </section>
    </section>
  );
}
