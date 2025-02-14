import styles from "./styles.module.css";
import Image from "next/image";
import chatImage from "@/public/chat.png";
import { RichText } from '@/components/common/richText/richText';
import { ResponseChat } from '@/components/common/responseChat/responseChat';
import { ChatType } from '@/actions/items';

type Props = {
  chats: ChatType[];
};

export const Chats = ({ chats }: Props) => {

  return (
    <article className={styles.container}>
  
      <section className={styles['chat-container']}>
        <article className={styles['chat-container__fabric']}>
          <RichText />
        </article>
      </section>

      {chats?.length === 0
        ?
          <section className={styles['chat-container--empty']}>
            <Image src={chatImage} alt={"Cuadros de chat de colores"} width={300} />
            <p>Aún no hay conversaciones sobre este proyecto</p>
          </section>
        :
          <section>
            {
              chats?.map((chat) => (
                <article key={chat.id} className={styles['chat-container']}>
                  <ResponseChat chat={chat}/>
                </article>
              ))
            }
          </section>
      }
    </article>
  );
};