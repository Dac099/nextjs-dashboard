import styles from './styles.module.css';
import {addGroup} from "@/actions/groups";

type Props = {
    params: Promise<{ id: string, viewId: string }>
};

export default async function Page({ params }: Props)
{
    const { id, viewId }  = await params;
    return (
        <article className={styles.container}>

        </article>
    );
}