'use client';
import styles from './resumedStatus.module.css';

type Props = {
  values: string[];
  totalItems: number;
}

export function ResumedStatus({values, totalItems}: Props){
  const transformedValues: {text: string, color: string}[] = values.map(value => JSON.parse(value));
  const valuesCounter = transformedValues.reduce((acc: Map<string, number>, val) => {
    if(!acc.get(val.color)){
      acc.set(val.color, 0);
    }

    acc.set(val.color, acc.get(val.color)! + 1);

    return acc;
  }, new Map<string, number>());

  valuesCounter.forEach((value, key, values) => {
    const percentage = (value * 100) / totalItems;
    values.set(key, percentage);
  });

  return (
    <article className={styles.container}>
      {
        valuesCounter.keys().map((color) => {
          const percentage = valuesCounter.get(color);
          return (
            <div 
              key={`${color}${Math.random()}`}
              style={{
                backgroundColor: color,
                width: `${percentage}%`
              }}
              className={styles.tagsContainer}
            >
              
            </div>
          );
        })
      }
    </article>
  );
}