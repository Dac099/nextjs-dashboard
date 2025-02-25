import styles from './styles.module.css';
import Image from 'next/image';
import {Tooltip} from "@/components/common/tooltip/tooltip";

type Props = {
    value: string | undefined;
};

export const Person = ( { value }: Props) => {
    return (
        <article className={styles.container}>
            <Tooltip text={'Nombre de Persona'}>
                <Image
                    src={'#'}
                    alt={'Fotografía del rostro del PM'}
                    width={25}
                    height={25}
                    className={styles['profile-picture']}
                />
            </Tooltip>
        </article>
    );
}
