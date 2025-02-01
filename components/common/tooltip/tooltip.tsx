import { ReactNode } from 'react';
import styles from './styles.module.css';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export const Tooltip = ({ text, children }: TooltipProps) => {
  return (
    <div className={styles.tooltipContainer}>
      {children}
      <span className={styles.tooltipText}>{text}</span>
    </div>
  );
};