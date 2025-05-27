import { useState } from 'react';

type Props = {
  callback: (value: string) => void;
};

export function PercentageColumn({ callback }: Props) {
  const [percentage, setPercentage] = useState<number>(0);

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
    callback(JSON.stringify(value));
  };

  return (
    <input
      type="number"
      value={percentage}
      min={0}
      max={100}
      step={1}
      onChange={(e) => handlePercentageChange(Number(e.target.value))}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        margin: '0',
        display: 'block',
        textAlign: 'center'
      }}
    />
  );
}