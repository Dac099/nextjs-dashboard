'use client';
import { TableValue } from '@/utils/types/groups';
import styles from './percentage.module.css';
import {
  useEffect,
  useRef,
  useState,
  KeyboardEvent
} from 'react';
import { setPercentageValue } from '@/actions/groups';
import { useParams } from 'next/navigation';

type Props = {
  value: TableValue;
  columnId: string;
  itemId: string;
};

export function Percentage({ value, columnId, itemId }: Props) {
  const { id: boardId, viewId } = useParams() as { id: string, viewId: string };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [tableValue, setTableValue] = useState<number>(
    value.value
      ? JSON.parse(value.value)
      : 0
  );

  async function handleBlur() {
    setShowInput(false);
    await submitNewValue();
  }

  async function handleEnterKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      setShowInput(false);
      await submitNewValue();
    }
  }

  async function submitNewValue() {
    await setPercentageValue(boardId, viewId, itemId, columnId, tableValue);
  }

  useEffect(() => {
    if (showInput) {
      inputRef.current!.focus();
      inputRef.current!.select();
    }
  }, [showInput]);

  return (
    <article className={styles.container}>
      {showInput &&
        <input
          type="number"
          min={0}
          step={1}
          onBlur={() => handleBlur()}
          onKeyUp={(e) => handleEnterKey(e)}
          className={styles.inputValue}
          ref={inputRef}
          value={tableValue}
          onChange={e => setTableValue(parseInt(e.target.value))}
        />
      }
      {!showInput &&
        <p
          onClick={() => setShowInput(true)}
          className={styles.percentValue}
        >
          {tableValue} %
        </p>
      }
    </article>
  );
}
