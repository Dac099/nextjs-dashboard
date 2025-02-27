import styles from './styles.module.css';
import { BsChatLeftTextFill } from "react-icons/bs";
import { RiChatNewFill } from "react-icons/ri";
import {ResponseChats} from "@/utils/types/items";

type Props = {
    chatData: ResponseChats;
};

export const ChatRing = ({ chatData }: Props) => {
    const totalChats = 0;
    return (
        <article className={styles.container}>
            {totalChats > 0
                ?
                <>
                    <BsChatLeftTextFill size={18} className={styles['chat-full']}/>
                    <span className={styles.counter}>{totalChats}</span>
                </>
                : <RiChatNewFill size={21} className={styles['chat-empty']}/>
            }

        </article>
    );
}