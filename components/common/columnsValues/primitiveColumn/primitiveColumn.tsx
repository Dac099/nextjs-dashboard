import { useState } from 'react';
import styles from './primitiveColumn.module.css';

type Props = {
  callback: (value: string) => void;
  type: 'text' | 'number';
};

export function PrimitiveColumn({ callback, type }: Props) {
  const [value, setValue] = useState<string | number>(type === 'text' ? '' : 0);

  const handleBlur = (value: string | number) => {
    if(
      typeof value === 'string' && value.length === 0 || 
      value === null
    ){
      return;
    }
    callback(JSON.stringify(value));
  };

  return (
    <input 
      type={type} 
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => handleBlur(value)}
      className={styles.input}
    />
  );
}