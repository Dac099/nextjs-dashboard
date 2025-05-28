import styles from './chatsContainer.module.css';
import { RichText } from '../richText/richText';
import { useEffect, useState } from 'react';
import type { ResponseChat } from '@/utils/types/items';
import { getUserInfo } from '@/actions/auth';
import Chat from '../chat/chat';

type Props = {
  itemChats: ResponseChat[];
  setItemChats: React.Dispatch<React.SetStateAction<ResponseChat[]>>;
};

export function ChatsContainer({ itemChats, setItemChats }: Props) {
  const [userData, setUserData] = useState<{ id: string; name: string }>({} as { id: string; name: string });

  useEffect(() => {
    async function fetchData() {
      const userAccessData = await getUserInfo();
      setUserData(userAccessData);
    }

    fetchData();
  }, []);

  function addNewChat(chat: ResponseChat) {
    setItemChats((prev) => [chat, ...prev]);
  }

  return (
    <article className={styles.mainContainer}>
      <section className={styles.inputText}>
        <RichText addNewChat={addNewChat} />
      </section>
      <section className={styles.tasks}>
        {itemChats.map((chat) => (
          <Chat
            key={chat.id}
            chat={chat}
            userData={userData}
          />
        ))}
      </section>
    </article>
  );
}
