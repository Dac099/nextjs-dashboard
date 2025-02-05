'use client';

import { ItemData } from '@/utils/common/types';
import styles from './styles.module.css';
import { Tooltip } from '@/components/common/tooltip/tooltip';

type Props = {
  items: ItemData[];
  propertyTitle: string;
};

export const ResumeStatus = ({ items, propertyTitle }: Props) => {
  const propertiesByTitle = items
    .map((item) => item.properties)
    .flat()
    .filter((property) => property.propertyTitle === propertyTitle);

  const resumeTitle = propertiesByTitle[0].userTitle || propertiesByTitle[0].propertyTitle;
  const groupedProperties = Object.groupBy(propertiesByTitle, ({value}) => value as PropertyKey);
  const percentages = Object.keys(groupedProperties).map((key) => {
    const percentage = groupedProperties[key] ? (groupedProperties[key].length / items.length) * 100 : 0;
    return `${percentage}%`;
  });
  const gridPercentages = percentages.join(' ').trim();

  return (
    <article className={styles.container}>
      <p>{resumeTitle}</p>
      <section 
        className={styles['resume-square']} 
        style={{gridTemplateColumns: gridPercentages}}
      >
        {
          Object.keys(groupedProperties).map((key) => {
            const bgColor = groupedProperties[key]?.[0]?.color;
            const value = groupedProperties[key]?.[0]?.value;
            const percentage = groupedProperties[key] ? (groupedProperties[key].length / items.length) * 100 : 0;
            const tooltipText = `${value} ${groupedProperties[key]?.length}/${items.length} ${Math.round(percentage)}%`;

            return (
              <Tooltip
                key={key}
                text={tooltipText}
              >
                <div 
                  className={styles['square']} 
                  style={{backgroundColor: bgColor}}
                ></div>
              </Tooltip>
            );
          })
        }
      </section>
    </article>
  );
}