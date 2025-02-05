import styles from './styles.module.css';
import {ChatData} from "@/utils/common/types";
import { BsChatLeftTextFill } from "react-icons/bs";
import { RiChatNewFill } from "react-icons/ri";

type Props = {
    itemId: string;
    chats: ChatData[];
};

export const ChatRing = ({ itemId, chats }: Props) => {
    const totalChats = chats.length;
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