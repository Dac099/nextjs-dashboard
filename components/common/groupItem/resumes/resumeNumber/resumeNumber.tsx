import { PropertyData } from '@/utils/common/types';
import styles from './styles.module.css';
import { getResumeNumberProperties } from '@/actions/groups';

type Props = {
  numberProperties: PropertyData[];
};

export const ResumeNumber = ({numberProperties}: Props) => {
  const filteredProperties = items
    .map((item) => item.properties)
    .flat()
    .filter((property) => property.propertyTitle === propertyTitle);
  const definedTitle = filteredProperties[0].userTitle || filteredProperties[0].propertyTitle;
  const totalValue = filteredProperties.reduce((sum, property) => {
    const value = parseFloat(property.value as string); 
    return sum + (isNaN(value) ? 0 : value); 
  }, 0);

  console.log(filteredProperties, totalValue);
  return (
    <article className={styles.container}>
      <p>{definedTitle}</p>
      <p>{totalValue}</p>
      <span>suma</span>
    </article>
  );
}