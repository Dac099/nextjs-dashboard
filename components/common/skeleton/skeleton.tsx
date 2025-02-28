import styles from './skeleton.module.css';

type Props = {
  width: string;
  height: string;
  rounded: string;
};

export function Skeleton({width, height, rounded}: Props)
{

  return (
    <article className={styles.skeleton} style={{width: width, height: height, borderRadius: rounded}}>
      <div className={styles['skeleton-shimmer']}></div>
    </article>
  );
}