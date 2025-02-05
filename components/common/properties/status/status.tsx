import styles from './styles.module.css'
import {PropertyData} from "@/utils/common/types";

type Props = {
    property: PropertyData;
};

export const Status = ({ property }: Props) => {
    return (
        <article className={styles.container} style={{ backgroundColor: property.color}}>
            {property.value}
            <span className={styles.corner}></span>
        </article>
    );
}