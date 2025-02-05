import styles from './styles.module.css';
import Image from 'next/image';
import {Tooltip} from "@/components/common/tooltip/tooltip";
import {PropertyData} from "@/utils/common/types";

type Props = {
    property: PropertyData;
};

export const Person = ( { property }: Props) => {
    return (
        <article className={styles.container}>
            <Tooltip text={'Nombre de Persona'}>
                <Image
                    src={property.userName as string}
                    alt={'Fotografía del rostro del PM'}
                    width={25}
                    height={25}
                    className={styles['profile-picture']}
                />
            </Tooltip>
        </article>
    );
}
