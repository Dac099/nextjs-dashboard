import styles from './styles.module.css';
import {PropertyData} from "@/utils/common/types";

type Props = {
    property: PropertyData;
};

export const Primitive = ({ property }: Props) => {
    return (
        <article className={styles.container}>
            {property.value}
        </article>
    );
}