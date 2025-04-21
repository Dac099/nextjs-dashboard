import styles from './styles.module.css';
import { BsChatLeftTextFill } from "react-icons/bs";
import { useRouter } from 'next/navigation';

type Props = {
    itemId: string;
};

export const ChatRing = ({ itemId }: Props) => {
    const router = useRouter();

    function handleClick() {
        router.push(`?itemId=${itemId}`);
    }
    return (
        <article
            className={styles.container}
            onClick={handleClick}
        >
            <BsChatLeftTextFill size={18} className={styles['chat-full']} />
        </article>
    );
}
